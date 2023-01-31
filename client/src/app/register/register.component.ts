import {Component} from '@angular/core';
import {User} from "../model/user";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  public user: User = new User(0, "", "", "", new Date());
  public pass: string = "";

  constructor(
    private loginService: AuthService
  ) {
  }

  register() {
    this.loginService.register(this.user, this.pass)
      .subscribe(res => {
        console.log(res);
      });
  }
}
