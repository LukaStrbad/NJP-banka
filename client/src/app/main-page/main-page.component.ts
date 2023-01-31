import {Component} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {User} from "../model/user";

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
    if (!authService.isLoggedIn()) {
      setTimeout(() => {
        router.navigateByUrl("login").then(() => {});
      }, 2000);
    } else {
      this.user = authService.getUser()!;
    }
  }
}
