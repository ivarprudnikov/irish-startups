import { App } from './app';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { ROUTER_PROVIDERS } from '@angular/router';
import { HTTP_PROVIDERS } from '@angular/http'
import { APP_BASE_HREF, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { provide } from '@angular/core';

let basePath = '#!/'
if(document.location.href.match(/github\.io/) != null){
  basePath = document.location.pathname.replace(/^\//, '') + '#!/'
}

bootstrap(App, [
  ROUTER_PROVIDERS,
  provide(APP_BASE_HREF, {useValue: basePath}),
  HTTP_PROVIDERS
]).catch(err => console.error(err));
