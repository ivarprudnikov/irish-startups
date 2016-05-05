//import {Main} from './modules/main/index'
//import {APP_BASE_HREF, ROUTER_PROVIDERS, ROUTER_DIRECTIVES, RouteConfig, RouteParams, LocationStrategy, HashLocationStrategy} from '@angular/router';
//import {provide, Component} from '@angular/core';
//
//@Component({
//  selector: '#application',
//  viewProviders: [
//    ROUTER_PROVIDERS,
//    provide(APP_BASE_HREF, {useValue: '/'}),
//    provide(LocationStrategy, {useClass: HashLocationStrategy})
//  ],
//  template: `
//    <h1>The app goes here</h1>
//  `
//})
//@RouteConfig([
//  { path: '/', component: Main, name: 'Main', useAsDefault: true }
//])
//export class App {}

import { Component } from '@angular/core';

@Component({
  selector: '#application',
  template: '<h1>Foo Bar</h1>'
})
export class App { }
