import { Controller, Post, Body } from '@nestjs/common';
import { CustomerService } from '../services/customer.service';
import { CreateCustomerDto } from '../types';

@Controller('/customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}
  @Post()
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.createCustomer(createCustomerDto);
  }
}
