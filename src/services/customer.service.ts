import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Customer, CustomerDocument } from '../schemas/customer.schema';
import { Model } from 'mongoose';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name)
    private readonly customerModel: Model<CustomerDocument>,
  ) {}

  async createUser(customer: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    bvn: string;
    email: string;
  }): Promise<CustomerDocument> {
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
}
