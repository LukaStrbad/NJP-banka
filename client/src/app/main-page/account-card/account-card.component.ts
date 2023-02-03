import { Component, Input } from '@angular/core';
import { Account } from 'src/app/model/account';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-account-card',
  templateUrl: './account-card.component.html',
  styleUrls: ['./account-card.component.css']
})
export class AccountCardComponent {
  @Input() account!: Account

  constructor(private clipboard: Clipboard) { }

  copyIbanToClipboard() {
    this.clipboard.copy(this.account.iban);
  }
}
