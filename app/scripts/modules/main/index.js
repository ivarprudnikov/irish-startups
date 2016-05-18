import { Routes } from '@angular/router';
import { Component } from '@angular/core';
import { MdButton } from '@angular2-material/button';
import { MD_SIDENAV_DIRECTIVES } from '@angular2-material/sidenav';
import { Search } from './search'
import { MapToIterablePipe } from '../util/mapToIterable'
import { StartupDirective } from './startup'

@Component({
  selector: 'main-section',
  directives: [ MdButton, MD_SIDENAV_DIRECTIVES, StartupDirective ],
  template: `
    <section class="container search-results">
      <p *ngIf="loading">Loading ...</p>
      <p *ngIf="errorMessage">{{errorMessage}}</p>
      <ul class="list">
        <li *ngFor="let item of items | mapToIterable" class="list-item">
          <startup [details]="item"></startup>
        </li>
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
    this.list()
  }

  setLoader(isLoading){
    this.loading = isLoading
  }

  setItems(items){
    this.items = items
    this.setLoader(false)
  }

  setError(message){
    this.errorMessage = message
    this.setLoader(false)
  }

  list(){
    this.setLoader(true)
    this.searchService.list()
      .subscribe(
        items => this.setItems(items),
        error => this.setError(error)
      )
  }
}
