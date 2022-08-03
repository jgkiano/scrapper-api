import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, AuthDocument } from '../schemas/auth.schema';
import { Model } from 'mongoose';
import { OrganizationService } from './organization.service';
import { CustomerService } from './customer.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name)
    private readonly authModel: Model<AuthDocument>,
    private readonly organizationService: OrganizationService,
    private readonly customerService: CustomerService,
  ) {}

  async createAuth(auth: {
    username: string;
    password: string;
    customerId: string;
    organizationId: string;
  }): Promise<AuthDocument> {
    const existingCustomer = await this.customerService.fetchCustomer(
      auth.customerId,
    );
    if (!existingCustomer) {
      throw new NotFoundException('customer does not exist');
    }
    const existingOrganization =
      await this.organizationService.fetchOrganization(auth.organizationId);
    if (!existingOrganization) {
      throw new NotFoundException('organization does not exist');
    }
    const existingAuth = await this.authModel.findOne({
      customerId: auth.customerId,
      organizationId: auth.organizationId,
    });
    if (existingAuth) {
      throw new ConflictException('auth already exists');
    }
    const createdAuth = new this.authModel(auth);
    return createdAuth.save();
  }

  async fetchAuth(
    organizationId: string,
    customerId: string,
  ): Promise<AuthDocument | null> {
    return this.authModel.findOne({
      organizationId: organizationId,
      customerId: customerId,
    });
  }
}
