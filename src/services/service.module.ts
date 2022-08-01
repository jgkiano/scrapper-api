import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import {
  Organization,
  OrganizationSchema,
} from '../schemas/organization.schema';
import { Account, AccountSchema } from '../schemas/account.schema';
import { Auth, AuthSchema } from '../schemas/auth.schema';
import { Customer, CustomerSchema } from '../schemas/customer.schema';
import { Transaction, TransactionSchema } from '../schemas/transaction.schema';
import { OrganizationService } from './organization.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_URL}/${process.env.DATABASE_NAME}`,
    ),
    MongooseModule.forFeature([
      { name: Organization.name, schema: OrganizationSchema },
      { name: Account.name, schema: AccountSchema },
      { name: Auth.name, schema: AuthSchema },
      { name: Customer.name, schema: CustomerSchema },
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [],
  providers: [OrganizationService],
  exports: [OrganizationService],
})
export class ServiceModule {}
