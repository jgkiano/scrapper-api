import { Controller, Post, Body } from '@nestjs/common';
import { CustomerDocument } from '../schemas/customer.schema';
import { CustomerService } from '../services/customer.service';
import { CreateCustomerDto } from '../types';

@Controller('/customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}
  @Post()
  async createCustomer(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<CustomerDocument> {
    return this.customerService.createCustomer(createCustomerDto);
  }
}
