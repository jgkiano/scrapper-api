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
    return { message: 'API Live 🚀' };
  }
}
