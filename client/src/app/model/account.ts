import { ReceivingTransaction, SendingTransaction } from "./transaction"

export class Account {
  constructor(
    public iban: string,
    public balance: number,
    public userId: number,
    public currency: string,
  ) {
  }
}

export interface AccountInfo {
  balance: number,
  currency: string,
  iban: string,
  ingoingTransactions: ReceivingTransaction[],
  outgoingTransactions: SendingTransaction[],
}
