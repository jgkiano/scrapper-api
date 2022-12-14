import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Transaction,
  TransactionDocument,
} from '../schemas/transaction.schema';
import { Model } from 'mongoose';
import { AccountService } from './account.service';
import { FormatterService } from './formatter.service';

type CreateTransaction = {
  type: 'credit' | 'debit';
  date: Date;
  description?: string;
  amount: number;
  currency: string;
  senderAccountNumber: string;
  beneficiaryAccountNumber: string;
  txHash: string;
};

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<TransactionDocument>,
    private readonly accountService: AccountService,
    private readonly formatterService: FormatterService,
  ) {}

  async createTransaction(
    accountId: string,
    transaction: CreateTransaction,
  ): Promise<Transaction & { id: string }> {
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
    const doc = await createdTransaction.save();
    return this.formatterService.formatDocument<Transaction>(doc);
  }

  async createBulkTransactions(
    accountId: string,
    transactions: CreateTransaction[],
  ): Promise<(Transaction & { id: string })[]> {
    try {
      const existingAccount = await this.accountService.fetchAccount(accountId);
      if (!existingAccount) {
        throw new NotFoundException('account does not exist');
      }
      const uniqueTransactions = [];
      const existingTransactions: TransactionDocument[] = [];
      for (const transaction of transactions) {
        const existingTransaction = await this.fetchTransactionByHash(
          transaction.txHash,
        );
        if (!existingTransaction) {
          uniqueTransactions.push(transaction);
        } else {
          existingTransactions.push(existingTransaction);
          console.log('skipping, existing transaction');
        }
      }
      const result = await this.transactionModel.create(
        uniqueTransactions.map((transaction) => {
          return {
            ...transaction,
            organizationId: existingAccount.organizationId,
            customerId: existingAccount.customerId,
            accountId: existingAccount.id,
          };
        }),
      );
      return [...result, ...existingTransactions].map((transaction) =>
        this.formatterService.formatDocument<Transaction>(transaction),
      );
    } catch (error) {
      console.error(error);
    }
  }

  async fetchTransactionByHash(txHash: string) {
    // TODO: speed this up using redis
    return this.transactionModel.findOne({ txHash: txHash });
  }
}
