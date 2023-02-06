import { Component, OnInit } from '@angular/core';
import { Admin } from 'src/app/model/transaction';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin-transactions',
  templateUrl: './admin-transactions.component.html',
  styleUrls: ['./admin-transactions.component.css']
})
export class AdminTransactionsComponent implements OnInit {
  transactions: Admin.Transaction[] = [];
  error = "";

  constructor(
    private adminService: AdminService
  ) {
    adminService.errorEmitter.subscribe(err => this.error = `<br> ${err}`);
  }

  ngOnInit(): void {
    this.init();
  }

  async init() {
    this.transactions = await this.adminService.getTransactions() ?? [];
  }
}
