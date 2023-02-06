import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Account } from '../model/account';
import { ApiResponse } from '../model/api-response';
import { User } from '../model/user';
import { Admin } from '../model/transaction';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  apiUrl = `${environment.API_URL}/admin`;
  errorEmitter = new Subject<string>();

  constructor(
    private http: HttpClient
  ) { }

  async getUsers(): Promise<User[] | null> {
    let res = await lastValueFrom(this.http
      .get<ApiResponse>(`${this.apiUrl}/users`));

    if (!res.success) {
      this.errorEmitter.next(res.description);
      return null;
    }

    return res.value as User[];
  }

  async makeAdmin(userId: number): Promise<void | null> {
    let res = await lastValueFrom(this.http
      .patch<ApiResponse>(`${this.apiUrl}/users/make-admin`,
        { userId: userId }));

    if (!res.success) {
      this.errorEmitter.next(res.description);
      return null;
    }
  }

  async getAccounts(): Promise<Account[] | null> {
    let res = await lastValueFrom(this.http
      .get<ApiResponse>(`${this.apiUrl}/accounts`));

    if (!res.success) {
      this.errorEmitter.next(res.description);
      return null;
    }

    return res.value as Account[];
  }

  async getTransactions(): Promise<Admin.Transaction[] | null> {
    let res = await lastValueFrom(this.http
      .get<ApiResponse>(`${this.apiUrl}/transactions`));

    if (!res.success) {
      this.errorEmitter.next(res.description);
      return null;
    }

    return res.value as Admin.Transaction[];
  }
}
