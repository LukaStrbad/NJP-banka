import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {switchMap} from "rxjs";
import {Account} from "../model/account";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-atm-simulator',
  templateUrl: './atm-simulator.component.html',
  styleUrls: ['./atm-simulator.component.css']
})
export class AtmSimulatorComponent implements OnInit {
  account: Account | null = null

  private getTokenHeader() {
    return new HttpHeaders({"token": this.loginService.getToken() ?? ""});
  }

  constructor(
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    private loginService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      let iban = params["iban"];

      this.httpClient.get(`/api/accounts/${iban}`, {headers: this.getTokenHeader()})
        .subscribe((res: any) => {
          console.log(res);
          if (res.success) {
            this.account = res.value;
          }
        })
    });
  }
}

enum ATMAction {
  None,
  Deposit,
  Withdraw,
}
