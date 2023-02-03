import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from "../model/user";
import { AuthService } from "../services/auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  value: {
    email: string,
    firstName: string,
    lastName: string,
    dateOfBirth: Date,
    password: string
  } = {
      email: '',
      firstName: '',
      lastName: '',
      dateOfBirth: new Date(),
      password: ''
    };

  passConfirm = "";
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
  }
  ngOnInit(): void {
    this.authService.authChange.subscribe(loggedIn => {
      if (loggedIn) {
        this.router.navigateByUrl("main").then(() => {
        });
      }
    });
    this.authService.errorEmitter.subscribe(msg => this.error = msg);
  }

  async register() {
    await this.authService.register(this.value);
  }
}
