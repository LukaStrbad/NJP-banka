import {Component} from '@angular/core';
import {Account} from "../model/account";
import {AuthService} from "../services/auth.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import { environment } from 'src/environments/environment';

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
    private httpClient: HttpClient,
    private router: Router
  ) {
    let user = authService.getUser();
    if (user == null) {
      return;
    }

    httpClient
      .get<Account[]>(this.apiUrl)
      .subscribe(res => {
        this.accounts = res;
      });
  }

  openAccount() {
    let user = this.authService.getUser();
    if (user == null) {
      return;
    }

    // this.httpClient
    //   .post(`/api/accounts/${user.id}/openNew`, {}, {headers: this.getTokenHeader()})
    //   .subscribe((res: any) => {
    //     console.log(res);
    //     if (res.success) {
    //       window.location.reload();
    //     } else {
    //       this.showAccountCreateError = true;
    //     }
    //   });
  }
}
