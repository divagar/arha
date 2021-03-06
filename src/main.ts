import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ArhaModule } from './app/arha.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(ArhaModule)
  .then(() => {
    //TODO: To enable after the app shell is enabled.
    // if ('serviceWorker' in navigator) {
    //   navigator.serviceWorker.register('/worker-basic.js');
    // }
  });