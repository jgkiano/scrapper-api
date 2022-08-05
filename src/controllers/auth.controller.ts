import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CreateAuthDto } from '../types';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post()
  async createAuth(
    @Body() createAuthDto: CreateAuthDto,
  ): Promise<{ message: string }> {
    await this.authService.createAuth(createAuthDto);
    return { message: 'ack' };
  }
}
