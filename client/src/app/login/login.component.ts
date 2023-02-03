import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email = "";
  password = "";
  message = "";

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.authService.authChange.subscribe(loggedIn => {
      if (loggedIn) {
        this.router.navigateByUrl("main").then(() => {
        });
      }
    });
    this.authService.errorEmitter.subscribe(msg => this.message = msg);
  }

  login() {
    this.authService.login(this.email, this.password);
  }
}
