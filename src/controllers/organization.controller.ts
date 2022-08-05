import { Controller, Post, Body } from '@nestjs/common';
import { OrganizationDocument } from '../schemas/organization.schema';
import { OrganizationService } from '../services/organization.service';
import { CreateOrganizationDto } from '../types';

@Controller('/organization')
export class OrganizationController {
  constructor(private readonly organizationSerivce: OrganizationService) {}
  @Post()
  async createOrganization(
    @Body() createOrganizationDto: CreateOrganizationDto,
  ): Promise<OrganizationDocument> {
    return this.organizationSerivce.createOrganization(createOrganizationDto);
  }
}
