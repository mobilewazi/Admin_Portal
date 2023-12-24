import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import { init } from 'aos';

init({
  duration: 1200,
  once: true
});

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
