export class Transaction {
  constructor(
    public id: number,
    public senderIBAN: string,
    public receiverIBAN: string,
    public exchangeRate: number | null,
    public timestamp: Date
  ) {
  }
}
