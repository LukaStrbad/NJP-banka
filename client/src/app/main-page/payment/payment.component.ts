import { Component, OnInit } from '@angular/core';
import { Account } from 'src/app/model/account';
import { AccountsService } from 'src/app/services/accounts.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  accounts: Account[] = [];
  currentAccount: Account | null = null;

  constructor(
    private accountsService: AccountsService
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

}
