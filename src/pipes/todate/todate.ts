import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the TodatePipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'todate',
})
export class TodatePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string) {
    let date = new Date(value);
    let fDate = (date.getMonth() + 1) +"."+ date.getDate() +"."+date.getFullYear();
    return fDate;
  }
}
