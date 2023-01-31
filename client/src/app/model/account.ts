export class Account {
  constructor(
    public iban: string,
    public balance: number,
    public userId: number,
    public currency: string,
  ) {
  }
}
