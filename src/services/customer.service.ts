import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Customer, CustomerDocument } from '../schemas/customer.schema';
import { Model } from 'mongoose';
import { FormatterService } from './formatter.service';

export type CreateCustomer = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  bvn: string;
  email: string;
};

export type UpdateCustomer = {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  bvn?: string;
  email?: string;
};

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name)
    private readonly customerModel: Model<CustomerDocument>,
    private readonly formatterService: FormatterService,
  ) {}

  async createCustomer(
    customer: CreateCustomer,
  ): Promise<Customer & { id: string }> {
    const existingCustomer = await this.customerModel.findOne({
      bvn: customer.bvn,
    });
    if (existingCustomer) {
      throw new ConflictException('customer already exists');
    }
    const createdUser = new this.customerModel(customer);
    const doc = await createdUser.save();
    return this.formatterService.formatDocument<Customer>(doc);
  }

  async fetchCustomer(
    customerId: string,
  ): Promise<(Customer & { id: string }) | null> {
    const customer = await this.customerModel.findById(customerId);
    if (!customer) {
      return null;
    }
    return this.formatterService.formatDocument(customer);
  }

  async updateCustomer(
    customerId: string,
    customer: UpdateCustomer,
  ): Promise<(Customer & { id: string }) | null> {
    const updatedCustomer = await this.customerModel.findByIdAndUpdate(
      customerId,
      customer,
      {
        new: true,
      },
    );
    if (!updatedCustomer) {
      return null;
    }
    return this.formatterService.formatDocument<Customer>(updatedCustomer);
  }
}
