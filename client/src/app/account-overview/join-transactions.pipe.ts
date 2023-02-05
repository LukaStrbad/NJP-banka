import { Pipe, PipeTransform } from '@angular/core';
import { ReceivingTransaction, SendingTransaction, Transaction } from '../model/transaction';

@Pipe({
  name: 'joinTransactions'
})
export class JoinTransactionsPipe implements PipeTransform {

  transform(value: Transaction[], other: Transaction[]): { type: string, transaction: SendingTransaction | ReceivingTransaction }[] {
    let result = value.concat(other);
    return result.map(transaction => {
      // If it's sending transaction
      if ("exchangeRate" in transaction) {
        return {
          type: "sending",
          transaction: transaction
        };
      }
      return {
        type: "receiving",
        transaction: transaction
      };
    });
  }

}
