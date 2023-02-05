import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email = "";
  password = "";
  message = "";

  tokenExpired = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    if (this.route.snapshot.queryParams["expired"] !== undefined) {
      console.log("Token has expired");
      this.tokenExpired = true;
    }

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
