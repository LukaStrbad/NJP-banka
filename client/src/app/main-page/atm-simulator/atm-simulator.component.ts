import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Account } from "../../model/account";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "../../services/auth.service";
import { AccountsService } from 'src/app/services/accounts.service';
@Component({
  selector: 'app-atm-simulator',
  templateUrl: './atm-simulator.component.html',
  styleUrls: ['./atm-simulator.component.css']
})
export class AtmSimulatorComponent implements OnInit {
  account: Account | null = null;
  accounts: Account[] = [];

  constructor(
    private route: ActivatedRoute,
    private accountsService: AccountsService
  ) {
  }
  
  ngOnInit(): void {
    this.init();
  }
  
  async init() {
    this.accounts = await this.accountsService.getAllAccounts();

    let iban = this.route.snapshot.params["iban"];
    let account = this.accounts.find(a => a.iban === iban);
    if (account) {
      this.account = account;
    }
  }
}

enum ATMAction {
  None,
  Deposit,
  Withdraw,
}
