import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  transform<T>(value: T[], ascending = false, field: keyof T, nestedField: string | null = null): T[] {
    return value.sort((a, b) => {
      let res = a[field] > b[field] ? -1 : 1;

      if (nestedField != null) {
        let aVal = (a[field] as any)[nestedField];
        let bVal = (b[field] as any)[nestedField];
        res = aVal > bVal ? -1 : 1;
      }

      if (ascending) {
        res = -res;
      }
      return res;
    });
  }

}