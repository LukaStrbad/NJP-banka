import { Component, OnInit } from '@angular/core';
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
  error = "";
  currentUser: User | null = null;

  constructor(
    private adminService: AdminService,
    authService: AuthService
  ) {
    adminService.errorEmitter.subscribe(err => this.error = err);
    this.currentUser = authService.getUser();
  }

  ngOnInit(): void {
    this.init();
  }

  async init() {
    this.users = await this.adminService.getUsers() ?? [];
  }

  async promoteToAdmin(id: number) {
    this.error = "";

    let res = await this.adminService.makeAdmin(id);

    if (res.success) {
      await this.init();
    }
  }
}
