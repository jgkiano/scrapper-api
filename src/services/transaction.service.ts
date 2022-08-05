import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Transaction,
  TransactionDocument,
} from '../schemas/transaction.schema';
import { Model } from 'mongoose';
import { AccountService } from './account.service';

type CreateTransaction = {
  type: 'credit' | 'debit';
  date: Date;
  description?: string;
  amount: number;
  currency: string;
  senderAccountNumber: string;
  beneficiaryAccountNumber: string;
};

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<TransactionDocument>,
    private readonly accountService: AccountService,
  ) {}

  async createTransaction(
    accountId: string,
    transaction: CreateTransaction,
  ): Promise<TransactionDocument> {
    const existingAccount = await this.accountService.fetchAccount(accountId);
    if (!existingAccount) {
      throw new NotFoundException('account does not exist');
    }
    const createdTransaction = new this.transactionModel({
      ...transaction,
      organizationId: existingAccount.organizationId,
      customerId: existingAccount.customerId,
      accountId: existingAccount.id,
    });
    return createdTransaction.save();
  }

  async createBulkTransactions(
    accountId: string,
    transactions: CreateTransaction[],
  ) {
    const existingAccount = await this.accountService.fetchAccount(accountId);
    if (!existingAccount) {
      throw new NotFoundException('account does not exist');
    }
    await this.transactionModel.deleteMany({ accountId }); // TODO: look at date of transaction to see if it's a duplicate
    return this.transactionModel.create(
      transactions.map((transaction) => {
        return {
          ...transaction,
          organizationId: existingAccount.organizationId,
          customerId: existingAccount.customerId,
          accountId: existingAccount.id,
        };
      }),
    );
  }
}
