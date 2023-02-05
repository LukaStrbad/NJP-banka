import { Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';
import { User } from '../model/user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  user: User | null = null;
  currentRoute = "/main/overview";

  constructor(
    public authService: AuthService,
    router: Router
  ) {
    this.user = authService.getUser();
    this.currentRoute = router.url;

    // If user is not logged in redirect to /login
    this.authService.authChange
      .subscribe(async val => {
        if (!val) {
          await router.navigateByUrl("/login")
        }
      });

    router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe(val => {
        let navStart = val as NavigationStart;
        this.currentRoute = navStart.url;
      });
  }
}
