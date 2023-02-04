import { Component, Input } from '@angular/core';
import { SendingTransaction } from 'src/app/model/transaction';

@Component({
  selector: 'app-sent-card[sending][currentCurrency]',
  templateUrl: './sent-card.component.html',
  styleUrls: ['./sent-card.component.css']
})
export class SentCardComponent {
  @Input() sending!: SendingTransaction;
  @Input() currentCurrency!: string;
}
