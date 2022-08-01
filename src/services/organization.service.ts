import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Organization,
  OrganizationDocument,
} from '../schemas/organization.schema';
import { Model } from 'mongoose';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name)
    private readonly organizationModel: Model<OrganizationDocument>,
  ) {}

  async createOrganization(organization: {
    name: string;
    loginUrl: string;
  }): Promise<OrganizationDocument> {
    const existingOrganization = await this.organizationModel.findOne({
      loginUrl: organization.loginUrl,
    });
    if (existingOrganization) {
      throw new ConflictException('organization already exists');
    }
    const createdOrganization = new this.organizationModel(organization);
    return createdOrganization.save();
  }

  async fetchOrganization(
    organizationId: string,
  ): Promise<OrganizationDocument | null> {
    return this.organizationModel.findById(organizationId);
  }
}
