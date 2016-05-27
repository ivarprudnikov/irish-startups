import { Routes, Router, RouteSegment } from '@angular/router';
import { FORM_DIRECTIVES } from '@angular/common';
import { Component } from '@angular/core';
import { MdButton } from '@angular2-material/button';
import { MD_SIDENAV_DIRECTIVES } from '@angular2-material/sidenav';
import { Search } from './search'
import { MapToIterablePipe } from '../util/mapToIterable'
import { StartupDirective } from './startup'
import { PaginationDirective } from './pagination'

@Component({
  selector: 'main-section',
  directives: [ MdButton, StartupDirective, PaginationDirective, FORM_DIRECTIVES ],
  template: `
    <section class="container search-results">

      <div class="row">
        <div class="col-sm-4">
          <form #f="ngForm" (ngSubmit)="onFormSubmit(f.value)">
            <label>Query</label>
            <input type="search" name="query" ngControl="query">
            <button type="submit" md-button="">Search</button>
          </form>
        </div>
        <div class="col-sm-8">
          <p *ngIf="loading">Loading ...</p>
          <p *ngIf="errorMessage">{{errorMessage}}</p>
          <p *ngIf="total">{{total}} results</p>
          <ul class="list">
            <li *ngFor="let item of items | mapToIterable" class="list-item">
              <startup [details]="item"></startup>
            </li>
          </ul>
          <pagination [total]="total" [max]="params.max" [offset]="params.offset" (onParamsChange)="paginate($event)"></pagination>
        </div>
      </div>
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
    this.params = {}

    //console.debug('routeSegment.parameters', routeSegment.parameters)

    this.list(this.params)
  }

  setLoader(isLoading){
    this.loading = isLoading
  }

  setItems(results){
    results = results || {};
    this.items = results.items || [];
    this.total = results.total || this.items.length
    this.setLoader(false)
  }

  setError(message){
    this.errorMessage = message
    this.setLoader(false)
  }

  list(params){

    console.debug('search params', params)

    this.setItems({})
    this.setLoader(true)

    setTimeout(() => {
      this.searchService.list(params)
        .subscribe(
          results => this.setItems(results),
          error => this.setError(error)
        )
    }, 200)
  }

  onFormSubmit(data){
    Object.keys(data).forEach(k => this.params[k] = data[k])
    this.params.offset = 0
    this.list(this.params)
  }

  paginate(params){
    this.params.max = params.max
    this.params.offset = params.offset
    this.list(this.params)
    // TODO this.router.navigate(['/main', params]);
  }

}
