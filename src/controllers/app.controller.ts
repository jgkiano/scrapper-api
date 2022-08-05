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
    const organization = await this.organizationSerivce.createOrganization({
      loginUrl: 'https://bankof.okra.ng/login',
      name: 'okra bank',
    });
    let customer = await this.customerService.createCustomer({
      bvn: '12345678912',
      email: 'hi@kiano.me',
      firstName: 'Julius',
      lastName: 'Kiano',
      phoneNumber: '+254700110590',
    });
    await this.authService.createAuth({
      customerId: customer.id,
      organizationId: organization.id,
      password: 'b9fBOwsPExnakcTu',
      username: 'hi@kiano.me',
    });
    const data = await this.scrapperService.scrape(
      organization.id,
      customer.id,
    );
    customer = await this.customerService.updateCustomer(
      customer.id,
      data.customer,
    );
    const output = {};
    output['customer'] = customer.toJSON();
    output['accounts'] = [];
    for (const account of data.accounts) {
      const updatedAccount = await this.accountService.updateAccount(
        customer.id,
        organization.id,
        account.accountNumber,
        account,
      );
      const createdTransactions =
        await this.transactionService.createBulkTransactions(
          updatedAccount.id,
          account.transactions,
        );
      output['accounts'].push({
        ...updatedAccount.toJSON(),
        transactions: createdTransactions.map((transaction) =>
          transaction.toJSON(),
        ),
      });
    }
    return output;
  }
}
