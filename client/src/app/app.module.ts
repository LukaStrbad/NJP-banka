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
    PaymentComponent
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
