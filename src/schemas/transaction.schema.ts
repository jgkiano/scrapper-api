import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Organization } from './organization.schema';
import { Customer } from './customer.schema';
import { Account } from './account.schema';

export enum TransactionType {
  debit = 'debit',
  credit = 'credit',
}

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ required: true, enum: TransactionType })
  type: TransactionType;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: false })
  description: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  currency: string;

  @Prop({ required: true })
  senderAccountNumber: string;

  @Prop({ required: true })
  beneficiaryAccountNumber: string;

  @Prop({ required: true })
  txHash: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  })
  organizationId: Organization;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  })
  customerId: Customer;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  })
  accountId: Account;
}

export type TransactionDocument = Transaction & Document;

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
