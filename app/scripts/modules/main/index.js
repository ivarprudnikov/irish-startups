import { Routes, Router, RouteSegment } from '@angular/router';
import { Component } from '@angular/core';
import { MdButton } from '@angular2-material/button';
import { MD_SIDENAV_DIRECTIVES } from '@angular2-material/sidenav';
import { Search } from './search'
import { MapToIterablePipe } from '../util/mapToIterable'
import { StartupDirective } from './startup'
import { PaginationDirective } from './pagination'

@Component({
  selector: 'main-section',
  directives: [ MdButton, MD_SIDENAV_DIRECTIVES, StartupDirective, PaginationDirective ],
  template: `
    <section class="container search-results">
      <button md-raised-button="" (click)="list()">Reload results</button>
      <p *ngIf="loading">Loading ...</p>
      <p *ngIf="errorMessage">{{errorMessage}}</p>
      <p *ngIf="total">{{total}} results</p>
      <ul class="list">
        <li *ngFor="let item of items | mapToIterable" class="list-item">
          <startup [details]="item"></startup>
        </li>
      </ul>

      <pagination [total]="total" [max]="max" [offset]="offset" (onParamsChange)="paginate($event)"></pagination>

    </section>
  `,
  providers: [ Search ],
  pipes: [ MapToIterablePipe ]
})
export class Main {

  static get parameters(){
    return [Search, Router, RouteSegment]
  }

  constructor(searchService, router, routeSegment){
    this.searchService = searchService
    this.router = router
    this.routeSegment = routeSegment

    console.debug('routeSegment.parameters', routeSegment.parameters)

    // TODO pass params
    this.list()
  }

  setLoader(isLoading){
    this.loading = isLoading
  }

  setItems(results){
    results = results || {};
    console.debug('results', results);
    this.items = results.items || [];
    this.total = results.total || this.items.length
    this.setLoader(false)
  }

  setError(message){
    this.errorMessage = message
    this.setLoader(false)
  }

  list(params){

    this.setItems({})
    this.setLoader(true)

    setTimeout(() => {
      this.searchService.list(params)
        .subscribe(
          results => this.setItems(results),
          error => this.setError(error)
        )
    }, 1000)
  }

  paginate(params){
    console.debug('params', params)
    this.list(params)
    // TODO this.router.navigate(['/main', params]);
  }

}
