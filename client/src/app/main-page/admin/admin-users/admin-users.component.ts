import { Component, OnInit } from '@angular/core';
import { Account } from 'src/app/model/account';
import { User } from 'src/app/model/user';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  accounts: Account[] = [];
  error = "";
  currentUser: User | null = null;

  constructor(
    private adminService: AdminService,
    authService: AuthService
  ) {
    adminService.errorEmitter.subscribe(err => this.error = `<br> ${err}`);
    this.currentUser = authService.getUser();
  }

  ngOnInit(): void {
    this.init();
  }

  async init() {
    let [users, accounts] = await Promise
      .all([this.adminService.getUsers(), this.adminService.getAccounts()]);
    this.users = users ?? [];
    this.accounts = accounts ?? [];
  }

  getNumOfAccounts(id: number): number {
    return this.accounts.filter(a => a.userId == id).length;
  }

  async promoteToAdmin(id: number) {
    this.error = "";

    let res = await this.adminService.makeAdmin(id);

    if (res !== null) {
      await this.init();
    }
  }
}
