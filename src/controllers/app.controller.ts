import { Controller, Get } from '@nestjs/common';
import { AccountService } from '../services/account.service';
import { AuthService } from '../services/auth.service';
import { CustomerService } from '../services/customer.service';
import { OrganizationService } from '../services/organization.service';
import { ScrapperService } from '../services/scrapper.service';
import { TransactionService } from '../services/transaction.service';

@Controller()
export class AppController {
  constructor(
    private readonly scrapperService: ScrapperService,
    private readonly organizationSerivce: OrganizationService,
    private readonly customerService: CustomerService,
    private readonly authService: AuthService,
    private readonly accountService: AccountService,
    private readonly transactionService: TransactionService,
  ) {}

  @Get()
  async getHello() {
    const org = { id: '62ea6a6ddde2e251480fe198' };
    const user = { id: '62ea6a6edde2e251480fe19b' };
    const data = await this.scrapperService.scrape(org.id, user.id);
    const output = {};
    const updatedCustomer = await this.customerService.updateCustomer(
      user.id,
      data.customer,
    );
    output['customer'] = updatedCustomer.toJSON();
    output['accounts'] = [];
    for (const account of data.accounts) {
      const createdAccount = await this.accountService.updateAccount(
        updatedCustomer.id,
        org.id,
        account.accountNumber,
        account,
      );
      const createdTransactions =
        await this.transactionService.createBulkTransactions(
          createdAccount.id,
          account.transactions,
        );
      output['accounts'].push({
        ...createdAccount.toJSON(),
        transactions: createdTransactions.map((transaction) =>
          transaction.toJSON(),
        ),
      });
    }
    return output;
  }
}
