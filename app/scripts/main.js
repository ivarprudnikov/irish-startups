import { App } from './app';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { ROUTER_PROVIDERS } from '@angular/router';
import { APP_BASE_HREF, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { provide } from '@angular/core';

bootstrap(App, [
  ROUTER_PROVIDERS,
  provide(APP_BASE_HREF, {useValue: '#!/'}),
  //provide(LocationStrategy, {useClass: HashLocationStrategy})
]).catch(err => console.error(err));
