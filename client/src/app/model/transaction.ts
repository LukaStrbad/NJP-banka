export interface Transaction {
  iban?: string,
  amount: number,
  time_stamp: string
}

export interface ReceivingTransaction extends Transaction {
}

export interface SendingTransaction extends Transaction {
  receivingCurrency: string,
  exchangeRate: number
}
