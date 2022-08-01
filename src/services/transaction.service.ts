import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Transaction,
  TransactionDocument,
} from '../schemas/transaction.schema';
import { Model } from 'mongoose';
import { OrganizationService } from './organization.service';
import { CustomerService } from './customer.service';

type TransactionDto = {
  type: 'credit' | 'debit';
  date: Date;
  description?: string;
  amount: number;
  currency: string;
  senderAccountNumber: string;
  beneficiaryAccountNumber: string;
  organizationId: string;
  customerId: string;
};

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<TransactionDocument>,
    private readonly organizationService: OrganizationService,
    private readonly customerService: CustomerService,
  ) {}

  async createTransaction(
    transaction: TransactionDto,
  ): Promise<TransactionDocument> {
    const existingCustomer = await this.customerService.fetchCustomer(
      transaction.customerId,
    );
    if (!existingCustomer) {
      throw new NotFoundException('customer does not exist');
    }
    const existingOrganization =
      await this.organizationService.fetchOrganization(
        transaction.organizationId,
      );
    if (!existingOrganization) {
      throw new NotFoundException('customer does not exist');
    }
    const createdTransaction = new this.transactionModel(transaction);
    return createdTransaction.save();
  }

  async createBulkTransactions(transactions: TransactionDto[]) {
    return this.transactionModel.create(transactions);
  }
}
