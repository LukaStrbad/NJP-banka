import { Component } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { User } from "../model/user";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {
  user!: User

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    // If user is not logged in redirect to /login
    this.authService.authChange.subscribe(async value => {
      if (!value) {
        await router.navigateByUrl("login");
      }
    })
    this.user = authService.getUser()!;
  }
}
