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

export module Admin {
  export interface Transaction {
    sent: number;
    sentCurrency: string;
    received: number;
    receivedCurrency: string;
    sender: string;
    receiver: string;
    time_stamp: string
  }
}
