import { Component } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { NavigationStart, Router } from "@angular/router";
import { User } from "../model/user";
import { filter } from 'rxjs';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {
  user: User | null = null;

  constructor(
    public authService: AuthService,
    router: Router
  ) {
    this.user = authService.getUser();
  }
}
