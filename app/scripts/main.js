import { App } from './app';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { ROUTER_PROVIDERS } from '@angular/router';
import { HTTP_PROVIDERS } from '@angular/http'
import { APP_BASE_HREF, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { provide, enableProdMode } from '@angular/core';
import { CONFIG } from './generatedConfig'

if(CONFIG.environment === 'prod'){
  enableProdMode()
}

bootstrap(App, [
  ROUTER_PROVIDERS,
  provide(APP_BASE_HREF, {useValue: '#!/'}),
  HTTP_PROVIDERS
]).catch(err => console.error(err));
