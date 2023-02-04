import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RegisterComponent } from './register/register.component';
import { FormsModule } from "@angular/forms";
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { MainPageComponent } from './main-page/main-page.component';
import { RouterOutlet } from "@angular/router";
import { AtmSimulatorComponent } from './main-page/atm-simulator/atm-simulator.component';
import { OverviewComponent } from './main-page/overview/overview.component';
import { AuthService } from './services/auth.service';
import { AuthInterceptor } from './services/auth.interceptor';
import { AccountCardComponent } from './main-page/account-card/account-card.component';
import { AccountOverviewComponent } from './account-overview/account-overview.component';
import { PaymentComponent } from './main-page/payment/payment.component';
import { ReceivedCardComponent } from './account-overview/received-card/received-card.component';
import { SentCardComponent } from './account-overview/sent-card/sent-card.component';
import { JoinTransactionsPipe } from './account-overview/join-transactions.pipe';
import { OrderByPipe } from './pipes/order-by.pipe';
import { AtmMenuComponent } from './main-page/atm-simulator/atm-menu/atm-menu.component';
import { ViewBalanceComponent } from './main-page/atm-simulator/view-balance/view-balance.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    MainPageComponent,
    AtmSimulatorComponent,
    OverviewComponent,
    AccountCardComponent,
    AccountOverviewComponent,
    PaymentComponent,
    ReceivedCardComponent,
    SentCardComponent,
    JoinTransactionsPipe,
    OrderByPipe,
    AtmMenuComponent,
    ViewBalanceComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    RouterOutlet,
  ],
  providers: [
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
