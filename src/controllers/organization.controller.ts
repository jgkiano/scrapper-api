import { Controller, Post, Body } from '@nestjs/common';
import { OrganizationService } from '../services/organization.service';
import { CreateOrganizationDto } from '../types';

@Controller('/organizations')
export class OrganizationController {
  constructor(private readonly organizationSerivce: OrganizationService) {}
  @Post()
  async createOrganization(
    @Body() createOrganizationDto: CreateOrganizationDto,
  ) {
    return this.organizationSerivce.createOrganization(createOrganizationDto);
  }
}
