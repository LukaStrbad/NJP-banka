import { ReceivingTransaction, SendingTransaction } from "./transaction"

export interface Account {
  iban: string;
  balance: number;
  userId: number;
  currency: string;
}

export interface AccountInfo {
  balance: number,
  currency: string,
  iban: string,
  sendingTransactions: SendingTransaction[],
  receivingTransactions: ReceivingTransaction[],
}

export interface BasicAccountInfo {
  iban: string,
  currency: string,
  owner: string
}
