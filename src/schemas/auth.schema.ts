import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Organization } from './organization.schema';
import { Customer } from './customer.schema';

@Schema({ timestamps: true })
export class Auth {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

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

export type AuthDocument = Auth & Document;

export const AuthSchema = SchemaFactory.createForClass(Auth);
