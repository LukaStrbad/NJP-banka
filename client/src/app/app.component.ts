import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "./model/user";
import {Transaction} from "./model/transaction";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
  ) {
  }
}
