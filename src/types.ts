export type ScrappedProfile = {
  firstName: string;
  lastName: string;
  address: string;
  bvn: string;
  phoneNumber: string;
  email: string;
};

export type ScrappedTransaction = {
  type: 'debit' | 'redit';
  date: Date;
  description?: string;
  amount: string;
  beneficiary: string;
  sender: string;
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
