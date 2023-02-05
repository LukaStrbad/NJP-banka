import { Routes } from "@angular/router";
import { AtmMenuComponent } from "./atm-menu/atm-menu.component";
import { AtmSimulatorComponent } from "./atm-simulator.component";
import { MoneyDepositComponent } from "./money-deposit/money-deposit.component";
import { MoneyWithdrawalComponent } from "./money-withdrawal/money-withdrawal.component";
import { ViewBalanceComponent } from "./view-balance/view-balance.component";

export const atmRoutes: Routes = [
  {
    path: ":iban",
    component: AtmMenuComponent,
  },
  {
    path: ":iban/view-balance",
    component: ViewBalanceComponent
  },
  {
    path: ":iban/withdraw",
    component: MoneyWithdrawalComponent
  },
  {
    path: ":iban/deposit",
    component: MoneyDepositComponent
  }
]