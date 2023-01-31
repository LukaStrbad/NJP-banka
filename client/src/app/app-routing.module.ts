import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {RegisterComponent} from "./register/register.component";
import {LoginComponent} from "./login/login.component";
import {MainPageComponent} from "./main-page/main-page.component";
import {OverviewComponent} from "./overview/overview.component";
import {AtmSimulatorComponent} from "./atm-simulator/atm-simulator.component";

const routes: Routes = [
  {path: "", redirectTo: "login", pathMatch: "full"},
  {
    path: "main", component: MainPageComponent,
    children: [
      {path: "", redirectTo: "overview", pathMatch: "full"},
      {path: "overview", component: OverviewComponent},
      {path: "atm/:iban", component: AtmSimulatorComponent},
    ]
  },
  {path: "register", component: RegisterComponent},
  {path: "login", component: LoginComponent}
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
