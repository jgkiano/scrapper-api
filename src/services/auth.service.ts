import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { InjectModel } from '@nestjs/mongoose';
import { Auth, AuthDocument } from '../schemas/auth.schema';
import { Model } from 'mongoose';
import { OrganizationService } from './organization.service';
import { CustomerService } from './customer.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name)
    private readonly authModel: Model<AuthDocument>,
    private readonly organizationService: OrganizationService,
    private readonly customerService: CustomerService,
  ) {}

  async createAuth(auth: {
    username: string;
    password: string;
    customerId: string;
    organizationId: string;
  }): Promise<AuthDocument> {
    const existingCustomer = await this.customerService.fetchCustomer(
      auth.customerId,
    );
    if (!existingCustomer) {
      throw new NotFoundException('customer does not exist');
    }
    const existingOrganization =
      await this.organizationService.fetchOrganization(auth.organizationId);
    if (!existingOrganization) {
      throw new NotFoundException('organization does not exist');
    }
    const existingAuth = await this.authModel.findOne({
      customerId: auth.customerId,
      organizationId: auth.organizationId,
    });
    if (existingAuth) {
      throw new ConflictException('auth already exists');
    }
    const createdAuth = new this.authModel({
      ...auth,
      password: this.encrypt(auth.password), // TODO: pad password with salt?
    });
    return createdAuth.save();
  }

  async fetchAuth(
    organizationId: string,
    customerId: string,
  ): Promise<AuthDocument | null> {
    const result = await this.authModel.findOne({
      organizationId: organizationId,
      customerId: customerId,
    });
    result.password = this.decrypt(result.password);
    return result;
  }

  private encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(process.env.ENCRYPTION_KEY),
      iv,
    );
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  private decrypt(text) {
    const textParts = text.split(':');
    const iv = Buffer.from(textParts.shift(), 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(process.env.ENCRYPTION_KEY),
      iv,
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}
