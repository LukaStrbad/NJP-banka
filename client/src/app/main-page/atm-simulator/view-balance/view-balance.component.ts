import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Account } from 'src/app/model/account';
import { AccountsService } from 'src/app/services/accounts.service';

@Component({
  selector: 'app-view-balance',
  templateUrl: './view-balance.component.html',
  styleUrls: ['./view-balance.component.css']
})
export class ViewBalanceComponent implements OnInit {
  account: Account | null = null;

  constructor(
    private route: ActivatedRoute,
    private accountsService: AccountsService
  ) {}

  ngOnInit(): void {
    this.init();
  }

  async init() {
    let accounts = await this.accountsService.getAllAccounts();

    let iban = this.route.snapshot.params["iban"];
    let account = accounts.find(a => a.iban === iban);

    if (account) {
      this.account = account;
    }
  }

}
