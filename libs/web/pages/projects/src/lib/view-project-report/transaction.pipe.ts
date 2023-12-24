import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  standalone: true,
  name: "mwaziTransaction"
})
export class TransactionPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
  }

  transform(value: any, args: any): any {
    let replacedValue = '<span class="text-success"> +' + value + ' KES</span>';
    if (args === 'D') {
      replacedValue = '<span class="text-danger"> -' + value + ' KES</span>';
    }
    // console.log(parseFloat(value.replace(/[^\d.]/g, '')), args)

    return this.sanitizer.bypassSecurityTrustHtml(replacedValue);
  }
}
