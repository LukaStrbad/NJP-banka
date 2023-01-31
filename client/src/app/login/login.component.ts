import {Component} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = "";
  password = "";
  message = "";

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    authService.authChange.subscribe(loggedIn => {
      if (loggedIn) {
        router.navigateByUrl("main").then(() => {
        });
      }
    });
    authService.errorEmitter.subscribe(msg => this.message = msg);
  }

  login() {
    this.authService.login(this.email, this.password);
  }
}
