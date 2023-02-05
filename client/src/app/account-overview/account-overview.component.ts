import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AccountInfo } from '../model/account';
import { AccountsService } from '../services/accounts.service';

@Component({
  selector: 'app-account-overview',
  templateUrl: './account-overview.component.html',
  styleUrls: ['./account-overview.component.css']
})
export class AccountOverviewComponent implements OnInit {
  iban: string;
  accountInfo: AccountInfo | null = null;
  singleList = false;

  constructor(
    private route: ActivatedRoute,
    private accountsService: AccountsService
  ) {
    this.iban = this.route.snapshot.params["iban"];
  }

  ngOnInit(): void {
    let singleList = localStorage.getItem("singleList");

    this.singleList = singleList === "true";

    this.init();
  }

  async init() {
    let accountInfo = await this.accountsService.getAccountInfo(this.iban);

    console.log(accountInfo);
    
    if (accountInfo != null) {
      this.accountInfo = accountInfo;
    }
  }

  changeSingleList() {
    this.singleList = !this.singleList;
    localStorage.setItem("singleList", this.singleList.toString());
  }
}
