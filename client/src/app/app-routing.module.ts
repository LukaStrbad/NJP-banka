import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";
import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { MainPageComponent } from "./main-page/main-page.component";
import { OverviewComponent } from "./main-page/overview/overview.component";
import { AtmSimulatorComponent } from "./main-page/atm-simulator/atm-simulator.component";
import { AccountOverviewComponent } from './account-overview/account-overview.component';
import { PaymentComponent } from './main-page/payment/payment.component';
import { atmRoutes } from './main-page/atm-simulator/atm-routing.module';
import { AdminUsersComponent } from './main-page/admin/admin-users/admin-users.component';
import { AdminAccountsComponent } from './main-page/admin/admin-accounts/admin-accounts.component';
import { AdminTransactionsComponent } from './main-page/admin/admin-transactions/admin-transactions.component';

const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  {
    path: "main", component: MainPageComponent,
    children: [
      { path: "", redirectTo: "overview", pathMatch: "full" },
      { path: "overview", component: OverviewComponent },
      { path: "atm", component: AtmSimulatorComponent, children: atmRoutes },
      { path: "payment", component: PaymentComponent },
      {
        path: "admin",
        children: [
          { path: "users", component: AdminUsersComponent },
          { path: "accounts", component: AdminAccountsComponent },
          { path: "transactions", component: AdminTransactionsComponent }
        ]
      }
    ]
  },
  { path: "register", component: RegisterComponent },
  { path: "login", component: LoginComponent },
  { path: "account-overview/:iban", component: AccountOverviewComponent }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
