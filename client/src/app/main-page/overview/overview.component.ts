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
  showAccountCreateError = false;
  apiUrl = `${environment.API_URL}/accounts`;

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
    this.accounts = await this.accountsService.getAllAccounts();
  }

  async openAccount() {
    let user = this.authService.getUser();
    if (user == null) {
      return;
    }

    let response = await this.accountsService.openNew();

    if (response.success) {
      this.loadAccounts();
      this.showAccountCreateError = false;
    } else {
      this.showAccountCreateError = true;
    }
  }
}
