import { App } from './app';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { ROUTER_PROVIDERS } from '@angular/router';
import { HTTP_PROVIDERS } from '@angular/http'
import { APP_BASE_HREF, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { provide, enableProdMode } from '@angular/core';
import { CONFIG } from './generatedConfig'
import { APP_DATA_PROVIDERS } from './modules/data/bundle'

if(CONFIG.environment === 'prod'){
  enableProdMode()
}

bootstrap(App, [
  ROUTER_PROVIDERS,
  provide(APP_BASE_HREF, {useValue: '/'}),
  provide(LocationStrategy, {useClass: HashLocationStrategy}),
  HTTP_PROVIDERS,
  APP_DATA_PROVIDERS
]).catch(err => console.error(err));
