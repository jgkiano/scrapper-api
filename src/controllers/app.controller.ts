import { Controller, Get } from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';

@Controller()
export class AppController {
  constructor(private readonly service: TransactionService) {}

  @Get()
  async getHello() {
    const data = await this.service.createBulkTransactions([
      {
        organizationId: '62e7ea4d7c4a7cc849d8d53c',
        customerId: '62e7eac3b51306f0d5c8f81f',
        amount: 301,
        beneficiaryAccountNumber: '4048883915',
        currency: '$',
        date: new Date(),
        senderAccountNumber: '7154854816',
        type: 'credit',
        description:
          'deposit transaction at Ledner, Mohr and Braun using card ending with ***(...6957) for MVR 606.64 in account ***89731944',
      },
      {
        organizationId: '62e7ea4d7c4a7cc849d8d53c',
        customerId: '62e7eac3b51306f0d5c8f81f',
        amount: 302,
        beneficiaryAccountNumber: '4048883915',
        currency: '$',
        date: new Date(),
        senderAccountNumber: '7154854816',
        type: 'credit',
        description:
          'deposit transaction at Ledner, Mohr and Braun using card ending with ***(...6957) for MVR 606.64 in account ***89731944',
      },
    ]);
    return data.map((item) => item.toJSON());
  }
}
