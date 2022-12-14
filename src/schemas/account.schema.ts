import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Organization } from './organization.schema';
import { Customer } from './customer.schema';

@Schema({ timestamps: true })
export class Account {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  number: string;

  @Prop({ required: true })
  availableBalance: number;

  @Prop({ required: true })
  ledgerBalance: number;

  @Prop({ required: true })
  currency: string;

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
}

export type AccountDocument = Account & Document;

export const AccountSchema = SchemaFactory.createForClass(Account);
