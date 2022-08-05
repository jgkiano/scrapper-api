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
    // const user = await this.customerService.createCustomer({
    //   bvn: '12345678912',
    //   email: 'hi@kiano.me',
    //   firstName: 'Julius',
    //   lastName: 'Kiano',
    //   phoneNumber: '+254700110590',
    // });
    // const org = await this.organizationSerivce.createOrganization({
    //   loginUrl: 'https://google.com',
    //   name: 'Google',
    // });
    // const auth = await this.authService.createAuth({
    //   customerId: user.id,
    //   organizationId: org.id,
    //   password: 'mysecretpassword',
    //   username: 'Kiano',
    // });
    // return auth;
    return this.authService.fetchAuth(
      '62ecdffc1344115b07d6fdfe',
      '62ecdffc1344115b07d6fdfb',
    );
  }
}
