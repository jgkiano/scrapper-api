import { Controller, Get } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { OrganizationService } from '../services/organization.service';

@Controller()
export class AppController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get()
  async getHello() {
    const data = await this.organizationService.createOrganization({
      loginUrl: 'https://google.com',
      name: 'Google',
    });
    return data.toJSON();
  }
}
