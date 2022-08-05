import {
  IsAlpha,
  IsAlphanumeric,
  IsEmail,
  IsMongoId,
  IsNumberString,
  IsPhoneNumber,
  IsUrl,
} from 'class-validator';

export type ScrappedProfile = {
  firstName: string;
  lastName: string;
  address: string;
  bvn: string;
  phoneNumber: string;
  email: string;
};

export type ScrappedTransaction = {
  type: 'debit' | 'credit';
  date: Date;
  description?: string;
  amount: string;
  beneficiaryAccountNumber: string;
  senderAccountNumber: string;
  currency: string;
};

export type ScrappedAccount = {
  accountName: string;
  availableBalance: string;
  currency: string;
  ledgerBalance: string;
  accountNumber: string;
  transactions?: ScrappedTransaction[];
};

export class CreateOrganizationDto {
  @IsUrl()
  loginUrl: string;

  @IsAlpha()
  name: string;
}

export class CreateCustomerDto {
  @IsNumberString()
  bvn: string;

  @IsEmail()
  email: string;

  @IsAlphanumeric()
  firstName: string;

  @IsAlphanumeric()
  lastName: string;

  @IsPhoneNumber()
  phoneNumber: string;
}

export class CreateAuthDto {
  @IsMongoId()
  customerId: string;

  @IsMongoId()
  organizationId: string;

  @IsAlphanumeric()
  password: string;

  @IsAlphanumeric()
  username: string;
}

export class ScrapeDto {
  @IsMongoId()
  customerId: string;

  @IsMongoId()
  organizationId: string;
}
