import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Account, BasicAccountInfo } from 'src/app/model/account';
import { AccountsService } from 'src/app/services/accounts.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  accounts: Account[] = [];
  currentAccount: Account | null = null;
  receivingIban = "";
  amount = 0;
  receivingAccount: BasicAccountInfo | null | undefined;
  submitted = false;

  constructor(
    private accountsService: AccountsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.init();
  }

  async init() {
    this.accounts = await this.accountsService.getAllAccounts();
    this.currentAccount = this.accounts[0] ?? null;
  }

  senderChanged(event: EventTarget | null) {
    if (event instanceof HTMLSelectElement) {
      let select = event as HTMLSelectElement;
      this.currentAccount = this.accounts.find(a => a.iban == select.value) ?? null;
    }
  }

  async receiverChanged() {
    this.receivingAccount = await this.accountsService.getBasicInfo(this.receivingIban);;
  }

  async onSend() {
    if (!this.currentAccount || !this.receivingAccount) {
      return;
    }

    this.submitted = true;
    await this.accountsService.transferMoney(this.currentAccount.iban, this.receivingAccount.iban, this.amount);
  }

  reload() {
    this.router.navigateByUrl("/", {skipLocationChange: true}).then(() => {
      this.router.navigateByUrl("/main/payment");
    });
  }
}
