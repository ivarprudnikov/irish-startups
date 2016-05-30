import { Routes, Router, RouteSegment } from '@angular/router';
import { Component } from '@angular/core';
import { MdButton } from '@angular2-material/button';
import { MD_LIST_DIRECTIVES } from '@angular2-material/list';
import { MdProgressBar } from '@angular2-material/progress-bar';
import { Search } from './search'
import { MapToIterablePipe } from '../util/mapToIterable'
import { SearchCommandDirective } from './searchCommand'
import { SearchCategory } from './searchCategory'
import { PaginationDirective } from './pagination'

@Component({
  selector: 'main-section',
  directives: [ MdButton, MdProgressBar, MD_LIST_DIRECTIVES, PaginationDirective, SearchCommandDirective ],
  template: `
    <section class="container search-results">

      <div class="row">
        <div class="col-sm-3">
          <search-command [categories]="categories" (onParamsChange)="onFormSubmit($event)"></search-command>
        </div>

        <div class="col-sm-9">

          <md-list>

            <md-progress-bar *ngIf="loading" mode="indeterminate"></md-progress-bar>

            <h3 *ngIf="errorMessage" md-subheader>{{errorMessage}}</h3>
            <h3 *ngIf="total" md-subheader>Found {{total}} results</h3>

            <md-list-item *ngFor="let item of items | mapToIterable" class="startup-item">
              <h3 md-line class="title"> {{item.value.name}} </h3>
              <p md-line class="description" *ngIf="item.value.description"> {{item.value.description}} </p>
              <p md-line class="category"> {{item.value.category}} </p>
            </md-list-item>
          </md-list>

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
    this.categories = results.categories || []
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
    }, 1000)
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
