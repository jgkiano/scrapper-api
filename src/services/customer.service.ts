import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Customer, CustomerDocument } from '../schemas/customer.schema';
import { Model } from 'mongoose';

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
  ) {}

  async createCustomer(customer: CreateCustomer): Promise<CustomerDocument> {
    const existingCustomer = await this.customerModel.findOne({
      bvn: customer.bvn,
    });
    if (existingCustomer) {
      throw new ConflictException('customer already exists');
    }
    const createdUser = new this.customerModel(customer);
    return createdUser.save();
  }

  async fetchCustomer(customerId: string): Promise<CustomerDocument | null> {
    return this.customerModel.findById(customerId);
  }

  async updateCustomer(customerId: string, customer: UpdateCustomer) {
    return this.customerModel.findByIdAndUpdate(customerId, customer);
  }
}
