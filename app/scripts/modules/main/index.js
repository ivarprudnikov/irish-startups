import { Routes } from '@angular/router';
import { Component } from '@angular/core';
import { MdButton } from '@angular2-material/button';
import { MD_SIDENAV_DIRECTIVES } from '@angular2-material/sidenav';
import { Search } from './search'

@Component({
  selector: 'main-section',
  directives: [ MdButton, MD_SIDENAV_DIRECTIVES ],
  template: `
    <section class="container">
      <h1>Main component</h1>
      <ul>
        <li *ngFor="let item of list">{{item.id}}</li>
      </ul>
    </section>
  `,
  providers: [Search]
})
export class Main {

  static get parameters(){
    return [Search]
  }

  constructor(searchService){
    this.searchService = searchService
  }

  list(){
    this.searchService.list()
      .subscribe({
        heroes => this.list = heroes,
        error =>  this.errorMessage = error
    });
  }
}
