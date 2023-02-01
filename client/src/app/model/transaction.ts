export interface Transaction {
  iban: string,
  amount: number,
  exchangeRate: number,
  time_stamp: string
}

export interface ReceivingTransaction extends Transaction {
  sendingCurrency: string
}

export interface SendingTransaction extends Transaction {
  receivingCurrency: string
}
