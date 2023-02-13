import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountInfo } from 'src/app/model/account';
import { AccountsService } from 'src/app/services/accounts.service';
import { AtmService } from 'src/app/services/atm.service';

@Component({
  selector: 'app-money-deposit',
  templateUrl: './money-deposit.component.html',
  styleUrls: ['./money-deposit.component.css']
})
export class MoneyDepositComponent implements OnInit {
  banknotes: { denomination: number, amount: number }[] = [
    { denomination: 5, amount: 0 },
    { denomination: 10, amount: 0 },
    { denomination: 20, amount: 0 },
    { denomination: 50, amount: 0 },
    { denomination: 100, amount: 0 },
    { denomination: 200, amount: 0 },
    { denomination: 500, amount: 0 },
  ];

  account: AccountInfo | null = null
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

  async depositMoney() {
    if (!this.account) {
      return;
    }

    let sum = 0;
    this.banknotes.forEach(el => {
      sum += el.denomination * el.amount
    });

    let res = await this.atmService.depositMoney(this.account.iban, sum);

    this.account = null;
    if (res.success) {
      this.success = true;
    } else {
      this.error = res.description;
    }
  }
}
