import { Routes } from '@angular/router';
import { Component } from '@angular/core';
import { MdButton } from '@angular2-material/button';
import { MD_SIDENAV_DIRECTIVES } from '@angular2-material/sidenav';
import { Search } from './search'
import { MapToIterablePipe } from '../util/mapToIterable'

@Component({
  selector: 'main-section',
  directives: [ MdButton, MD_SIDENAV_DIRECTIVES ],
  template: `
    <section class="container">
      <h1>Main component</h1>
      <button md-raised-button="" (click)="list()">Go!</button>
      <ul>
        <li *ngFor="let item of items | mapToIterable">{{item.key}}</li>
      </ul>
    </section>
  `,
  providers: [ Search ],
  pipes: [ MapToIterablePipe ]
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
      .subscribe(
        items => { this.items = items },
        error => { this.errorMessage = error }
      )
  }
}
