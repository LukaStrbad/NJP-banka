import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccountInfo } from '../model/account';
import { ApiResponse } from '../model/api-response';

@Injectable({
  providedIn: 'root'
})
export class AtmService {
  apiUrl = `${environment.API_URL}/atm`;

  constructor(
    private http: HttpClient
  ) { }

  async withdrawMoney(accountIban: string, amount: number) {
    return await lastValueFrom(this.http
      .post<ApiResponse>(`${this.apiUrl}/withdraw`, {
        iban: accountIban,
        amount: amount
      }));
  }

  async depositMoney(accountIban: string, amount: number) {
    return await lastValueFrom(this.http
      .post<ApiResponse>(`${this.apiUrl}/deposit`, {
        iban: accountIban,
        amount: amount
      }));
  }
}
