import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Organization,
  OrganizationDocument,
} from '../schemas/organization.schema';
import { Model } from 'mongoose';
import { FormatterService } from './formatter.service';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name)
    private readonly organizationModel: Model<OrganizationDocument>,
    private readonly formatterService: FormatterService,
  ) {}

  async createOrganization(organization: {
    name: string;
    loginUrl: string;
  }): Promise<Organization & { id: string }> {
    const existingOrganization = await this.organizationModel.findOne({
      loginUrl: organization.loginUrl,
    });
    if (existingOrganization) {
      throw new ConflictException('organization already exists');
    }
    const createdOrganization = new this.organizationModel(organization);
    const doc = await createdOrganization.save();
    return this.formatterService.formatDocument<Organization>(doc);
  }

  async fetchOrganization(
    organizationId: string,
  ): Promise<(Organization & { id: string }) | null> {
    const organization = await this.organizationModel.findById(organizationId);
    if (!organization) {
      return null;
    }
    return this.formatterService.formatDocument<Organization>(organization);
  }
}
