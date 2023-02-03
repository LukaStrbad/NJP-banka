import { User } from "../model/user";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { lastValueFrom, Subject } from "rxjs";
import { ApiResponse } from "../model/api-response";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  authChange = new Subject<boolean>();
  errorEmitter = new Subject<string>();
  apiUrl = `${environment.API_URL}/auth`

  isLoggedIn() {
    return sessionStorage.getItem("user") != null;
  }

  getUser(): User | null {
    let user = sessionStorage.getItem("user");

    if (user == null) {
      return null;
    }

    return JSON.parse(user) as User;
  }

  getToken() {
    return sessionStorage.getItem("token");
  }

  constructor(
    private httpClient: HttpClient
  ) {
  }

  logout() {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    this.authChange.next(false);
  }

  handleLoginRegister(res: ApiResponse) {
    if (res.success) {
      sessionStorage.setItem("user", JSON.stringify(res.userInfo));
      sessionStorage.setItem("token", res.token ?? "");
      this.authChange.next(true);
    } else {
      this.authChange.next(false);
      this.errorEmitter.next(res.description);
    }
  }

  async login(email: string, password: string) {
    let res = await lastValueFrom(this.httpClient
      .post<ApiResponse>(`${this.apiUrl}/login`, { email: email, password: password }));

    this.handleLoginRegister(res);
  }

  async register(value: {
    email: string,
    firstName: string,
    lastName: string,
    dateOfBirth: Date,
    password: string
  }) {
    let res = await lastValueFrom(this.httpClient
      .post<ApiResponse>(`${this.apiUrl}/register`, value)
    );

    this.handleLoginRegister(res);
  }
}
