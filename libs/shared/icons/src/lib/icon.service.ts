import { Injectable } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { IconListEnum } from './icon.enum';

@Injectable({
  providedIn: 'root',
})
export class IconService {
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
  }

  registerIcon(iconName: IconListEnum, href = `svg/${iconName}.svg`) {
    this.matIconRegistry.addSvgIcon(
      iconName,
      this.domSanitizer.bypassSecurityTrustResourceUrl(href)
    );
  }

  registerIcons(iconNames: IconListEnum[]) {
    iconNames.forEach((iconName) => {
      this.registerIcon(iconName);
    });
  }
}
