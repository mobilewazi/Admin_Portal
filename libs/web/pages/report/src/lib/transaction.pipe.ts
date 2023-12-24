import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  standalone: true,
  name: "mwaziTransaction"
})
export class TransactionPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: any, args: any): any {
    let replacedValue = '<strong class="text-success">' +  value + '</strong>';
    if (args === 'D') {
       replacedValue = '<strong class="text-danger"> - ' +  value + '</strong>';
    }
    // console.log(parseFloat(value.replace(/[^\d.]/g, '')), args)

    return this.sanitizer.bypassSecurityTrustHtml(replacedValue);
  }
}
