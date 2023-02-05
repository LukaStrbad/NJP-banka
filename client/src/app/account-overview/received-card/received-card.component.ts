import { Component, Input } from '@angular/core';
import { ReceivingTransaction } from 'src/app/model/transaction';

@Component({
  selector: 'app-received-card[receiving][currentCurrency]',
  templateUrl: './received-card.component.html',
  styleUrls: ['./received-card.component.css']
})
export class ReceivedCardComponent {
  @Input() receiving!: ReceivingTransaction;
  @Input() currentCurrency!: string;
}
