import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Account, AccountInfo } from 'src/app/model/account';
import { AccountsService } from 'src/app/services/accounts.service';
import { AtmService } from 'src/app/services/atm.service';

@Component({
  selector: 'app-money-withdrawal',
  templateUrl: './money-withdrawal.component.html',
  styleUrls: ['./money-withdrawal.component.css']
})
export class MoneyWithdrawalComponent implements OnInit {
  values = [10, 20, 30, 50, 100, 200, 300];
  account: AccountInfo | null = null;
  withdrawAmount = 0;
  error: string | null = null;
  success = false;

  constructor(
    private route: ActivatedRoute,
    private accountsService: AccountsService,
    private atmService: AtmService
  ) { }

  ngOnInit(): void {
    this.init();
  }

  async init() {
    let iban = this.route.snapshot.params["iban"];
    this.account = await this.accountsService.getAccountInfo(iban);
  }

  async withdrawMoney(amount: number) {
    if (!this.account) {
      return;
    }

    let res = await this.atmService.withdrawMoney(this.account?.iban, amount);

    this.account = null;
    if (res.success) {
      this.success = true;
    } else {
      this.error = res.description;
    }
  }

}
