import { About } from './modules/about/index'
import { Main } from './modules/main/index'
import { Header } from './modules/header/index'
import { Routes, Router, RouteSegment, ROUTER_DIRECTIVES } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: '#application',
  template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
  `,
  directives: [ Header, ROUTER_DIRECTIVES ]
})
@Routes([
  { path: '/main', component: Main },
  { path: '/', component: About }
])
export class App {

  static get parameters() {
    return [[Router, RouteSegment]];
  }

  constructor(router, routeSegment){
    this.router = router
    this.routeSegment = routeSegment

    console.log('router',router)
    console.log('routeSegment',routeSegment)
    window.routeSegment = routeSegment
  }

  ngOnInit() {
    // TODO make sure params are not removed
    //this.router.navigate(['/about']);
  }

}
