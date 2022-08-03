import { BadRequestException, Injectable } from '@nestjs/common';
import { ScrappedAccount, ScrappedProfile } from '../types';
import validator from 'validator';
import { parsePhoneNumber } from 'libphonenumber-js';

@Injectable()
export class FormatterService {
  format(data: { profile: ScrappedProfile; accounts: ScrappedAccount[] }) {
    console.log(data.profile.phoneNumber);
    const phoneNumber = parsePhoneNumber(data.profile.phoneNumber, 'NG');
    // validate profile
    if (!validator.isEmail(data.profile.email)) {
      throw new BadRequestException('invalid email');
    }
    if (!phoneNumber.isValid()) {
      // TODO: how to handle diff countries?
      throw new BadRequestException('invalid phone number');
    }
    if (
      !validator.isAlpha(data.profile.bvn) &&
      data.profile.bvn.length !== 11
    ) {
      // TODO: can bvn go past 11 char?
      throw new BadRequestException('invalid bvn');
    }
    const customer = {
      ...data.profile,
      phoneNumber: phoneNumber.formatInternational(),
    };
    const formattedAccounts = data.accounts.map((account) => {
      return {
        ...account,
        availableBalance: Number(account.availableBalance),
        ledgerBalance: Number(account.ledgerBalance),
        transactions: account.transactions.length
          ? account.transactions.map((transaction) => {
              return {
                ...transaction,
                date: new Date(transaction.date),
                amount: Number(transaction.amount),
              };
            })
          : [],
      };
    });
    return {
      customer,
      accounts: formattedAccounts,
    };
  }
}