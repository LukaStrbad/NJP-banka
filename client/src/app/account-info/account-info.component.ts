import {Component, Input} from '@angular/core';
import {Account} from "../model/account";

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.css']
})
export class AccountInfoComponent {
  @Input() account!: Account
}
