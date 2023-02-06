import { Component } from '@angular/core';
import { Account } from "../../model/account";
import { AuthService } from "../../services/auth.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../../model/api-response';
import { AccountsService } from 'src/app/services/accounts.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent {
  accounts: Account[] | undefined = undefined;
  error: string | null = null;
  apiUrl = `${environment.API_URL}/accounts`;
  currencies: string[] = [];
  newAccountCurrency = "";

  constructor(
    private authService: AuthService,
    private accountsService: AccountsService
  ) {
    let user = authService.getUser();
    if (user == null) {
      return;
    }

    this.loadAccounts();
  }

  async loadAccounts() {
    [this.accounts, this.currencies] = await Promise
      .all([this.accountsService.getAllAccounts(), this.accountsService.getCurrencies()]);

    this.newAccountCurrency = this.currencies[0];
  }

  async openAccount() {
    let user = this.authService.getUser();
    if (user == null) {
      return;
    }

    let response = await this.accountsService.openNew(this.newAccountCurrency);

    if (response.success) {
      this.loadAccounts();
      this.error = null;
    } else {
      this.error = response.description;
    }
  }

  currencyChanged(event: EventTarget | null) {
    if (event instanceof HTMLSelectElement) {
      let select = event as HTMLSelectElement;
      this.newAccountCurrency = select.value;
    }
  }
}
