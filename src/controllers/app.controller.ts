import { Controller, Get } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CustomerService } from '../services/customer.service';
import { OrganizationService } from '../services/organization.service';
import { ScrapperService } from '../services/scrapper.service';

@Controller()
export class AppController {
  constructor(
    private readonly scrapperService: ScrapperService,
    private readonly organizationSerivce: OrganizationService,
    private readonly customerService: CustomerService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  async getHello() {
    const org = await this.organizationSerivce.createOrganization({
      loginUrl: 'https://bankof.okra.ng/login',
      name: 'okra bank',
    });
    const user = await this.customerService.createUser({
      bvn: '123456789',
      firstName: 'Julius',
      lastName: 'Kiano',
      phoneNumber: '+254700110590',
      email: 'hi@kiano.me',
    });
    const auth = await this.authService.createAuth({
      customerId: user.id,
      organizationId: org.id,
      password: 'b9fBOwsPExnakcTu',
      username: 'hi@kiano.me',
    });
    const data = this.scrapperService.scrape(org.id, user.id);
    return data;
  }
}
