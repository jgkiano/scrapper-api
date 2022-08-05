import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Account, AccountDocument } from '../schemas/account.schema';
import { Model } from 'mongoose';
import { OrganizationService } from './organization.service';
import { CustomerService } from './customer.service';

export type CreateAccount = {
  name: string;
  number: string;
  availableBalance: number;
  ledgerBalance: number;
  currency: string;
  organizationId: string;
  customerId: string;
};

export type UpdateAccount = {
  name?: string;
  availableBalance?: number;
  ledgerBalance?: number;
  currency?: string;
};

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name)
    private readonly accountModel: Model<AccountDocument>,
    private readonly organizationService: OrganizationService,
    private readonly customerService: CustomerService,
  ) {}

  async createAccount(account: CreateAccount): Promise<AccountDocument> {
    const existingOrganization =
      await this.organizationService.fetchOrganization(account.organizationId);
    if (!existingOrganization) {
      throw new NotFoundException('organization does not exist');
    }
    const existingCustomer = await this.customerService.fetchCustomer(
      account.customerId,
    );
    if (!existingCustomer) {
      throw new NotFoundException('customer does not exist');
    }
    const existingAccount = await this.accountModel.findOne({
      organizationId: account.organizationId,
      number: account.number,
    });
    if (existingAccount) {
      throw new ConflictException('account already exists');
    }
    const createdAccount = new this.accountModel(account);
    return createdAccount.save();
  }

  async fetchAccount(accountId: string): Promise<AccountDocument | null> {
    return this.accountModel.findById(accountId);
  }

  async fetch(query: {
    accountNumber: string;
    organizationId: string;
  }): Promise<AccountDocument | null> {
    return this.accountModel.findOne(query);
  }

  async updateAccount(
    customerId: string,
    organizationId: string,
    accountNumber: string,
    account: UpdateAccount,
  ) {
    return this.accountModel.findOneAndUpdate(
      {
        customerId: customerId,
        organizationId: organizationId,
        number: accountNumber,
      },
      account,
      { upsert: true, new: true },
    );
  }
}
