import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/api-response';
import { User } from '../model/user';

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
      return null;
    }

    return res.value as User[];
  }

  async makeAdmin(userId: number) {
    return await lastValueFrom(this.http
      .patch<ApiResponse>(`${this.apiUrl}/users/make-admin`,
        { userId: userId }));
  }
}
