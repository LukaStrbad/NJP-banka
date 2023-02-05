import { Component, OnInit } from '@angular/core';
import { Account } from 'src/app/model/account';
import { User } from 'src/app/model/user';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin-accounts',
  templateUrl: './admin-accounts.component.html',
  styleUrls: ['./admin-accounts.component.css']
})
export class AdminAccountsComponent implements OnInit {
  users: User[] = [];
  accounts: Account[] = [];

  constructor(
    private adminService: AdminService,
  ) {
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

  getOwner(userId: number) {
    let owner = this.users.find(u => u.id == userId);

    if (!owner) {
      return null;
    }

    return `${owner.firstName} ${owner.lastName}`
  }
}
