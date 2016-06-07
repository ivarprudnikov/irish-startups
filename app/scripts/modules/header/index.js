import { ROUTER_DIRECTIVES } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  directives: [ ROUTER_DIRECTIVES ],
  template: `
  <header class="navbar navbar-default navbar-main navbar-static-top" role="banner">
    <div class="container">
      <div class="navbar-header">
        <a [routerLink]="['/main']" class="navbar-brand logo">Irish Startup Ecosystem</a>
      </div>
    </div>
  </header>
  `
})
export class Header {}
