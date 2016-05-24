import { Main } from './modules/main/index'
import { Header } from './modules/header/index'
import { Routes, Router, ROUTER_DIRECTIVES } from '@angular/router';
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
  { path: '*', component: Main }
])
export class App {

  static get parameters() {
    return [[Router]];
  }

  constructor(router){
    this.router = router
  }

  ngOnInit() {
    // TODO make sure params are not removed
    this.router.navigate(['/main']);
  }

}
