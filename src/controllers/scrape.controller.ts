import { Controller, Post, Body } from '@nestjs/common';
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
  async scrape(@Body() scrapeDto: ScrapeDto): Promise<{ message: string }> {
    // TODO: best handled by a nestjs queue || bull?
    this.scrapeService
      .scrape(scrapeDto.organizationId, scrapeDto.customerId)
      .then(async (data) => {
        await this.customerService.updateCustomer(
          scrapeDto.customerId,
          data.customer,
        );
        for (const account of data.accounts) {
          const updatedAccount = await this.accountService.updateAccount(
            scrapeDto.customerId,
            scrapeDto.organizationId,
            account.accountNumber,
            account,
          );
          await this.transactionService.createBulkTransactions(
            updatedAccount.id,
            account.transactions,
          );
          console.log('records updated..');
        }
      })
      .catch(console.log);
    return { message: 'ack' };
  }
}
