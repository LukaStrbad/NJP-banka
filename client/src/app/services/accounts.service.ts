import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Account, AccountInfo, BasicAccountInfo } from '../model/account';
import { ApiResponse } from '../model/api-response';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  apiUrl = `${environment.API_URL}/accounts`;

  constructor(
    private http: HttpClient
  ) { }

  async getAllAccounts() {
    return await lastValueFrom(this.http.get<Account[]>(this.apiUrl));
  }

  async getAccountInfo(iban: string): Promise<AccountInfo | null> {
    let response = await lastValueFrom(this.http.get<ApiResponse>(`${this.apiUrl}/${iban}`));

    if (!response.success) {
      return null;
    }

    return response.value;
  }

  async getBasicInfo(iban: string): Promise<BasicAccountInfo | null> {
    let response = await lastValueFrom(this.http.get<ApiResponse>(`${this.apiUrl}/${iban}/basic-info`));

    if (!response.success) {
      return null;
    }

    return response.value;
  }

  async openNew() {
    return await lastValueFrom(this.http.post<ApiResponse>(`${this.apiUrl}/open-new`, {}));
  }

  async transferMoney(senderIban: string, receiverIban: string, amount: number) {
    return await lastValueFrom(this.http.post(`${this.apiUrl}/${senderIban}/transfer-money`, {
      receiverIban: receiverIban,
      amount: amount
    }));
  }
}
