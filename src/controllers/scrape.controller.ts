import { Controller, Post, Body, Query } from '@nestjs/common';
import { ScrapperService } from '../services/scrapper.service';
import { CustomerService } from '../services/customer.service';
import { AccountService } from '../services/account.service';
import { TransactionService } from '../services/transaction.service';
import { ScrapeDto } from '../types';

@Controller('/scrape')
export class ScrapeController {
  constructor(
    private readonly scrapeService: ScrapperService,
    private readonly customerService: CustomerService,
    private readonly accountService: AccountService,
    private readonly transactionService: TransactionService,
  ) {}
  @Post()
  async scrape(@Body() scrapeDto: ScrapeDto, @Query('limit') limit: number) {
    // TODO: best handled by a nestjs queue || bull?
    const data = await this.scrapeService.scrape(
      scrapeDto.organizationId,
      scrapeDto.customerId,
      limit || 5,
    );
    const output = {};
    const customer = await this.customerService.updateCustomer(
      scrapeDto.customerId,
      data.customer,
    );
    output['customer'] = customer;
    output['accounts'] = [];
    for (const account of data.accounts) {
      const updatedAccount = await this.accountService.updateAccount(
        scrapeDto.customerId,
        scrapeDto.organizationId,
        account.accountNumber,
        account,
      );
      const createdTransactions =
        await this.transactionService.createBulkTransactions(
          updatedAccount.id,
          account.transactions,
        );
      output['accounts'].push({
        ...updatedAccount,
        transactions: createdTransactions,
      });
    }
    return output;
  }
}
