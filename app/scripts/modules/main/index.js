import { Routes, Router, RouteSegment } from '@angular/router';
import { Component } from '@angular/core';
import { MdButton } from '@angular2-material/button';
import { MD_LIST_DIRECTIVES } from '@angular2-material/list';
import { MdProgressBar } from '@angular2-material/progress-bar';
import { MD_SIDENAV_DIRECTIVES } from '@angular2-material/sidenav'
import { OrganisationService } from '../data/organisationService'
import { Aggregations } from '../data/aggregationsModel'
import { MapToIterablePipe } from '../util/mapToIterablePipe'
import { SearchCommandDirective } from './searchCommand'
import { SearchResultDirective } from './searchResultDirective'
import { PaginationDirective } from './../util/paginationDirective'

@Component({
  selector: 'main-section',
  directives: [ MdButton, MdProgressBar, MD_LIST_DIRECTIVES, MD_SIDENAV_DIRECTIVES, PaginationDirective, SearchCommandDirective, SearchResultDirective ],
  pipes: [ MapToIterablePipe ],
  template: `
    <md-sidenav-layout>

      <md-sidenav #sidenav mode="over" align="end">
        <search-result [item]="selected"></search-result>
      </md-sidenav>

      <section class="container search-results">

        <div class="row">
          <div class="col-sm-3">
            <search-command [aggregations]="aggregations" (onParamsChange)="onFormSubmit($event)"></search-command>
          </div>

          <div class="col-sm-9">

            <md-list>

              <md-progress-bar *ngIf="loading" mode="indeterminate"></md-progress-bar>

              <h3 *ngIf="errorMessage" md-subheader>{{errorMessage}}</h3>
              <h3 *ngIf="total" md-subheader>Found {{total}} results</h3>

              <md-list-item *ngFor="let item of items | mapToIterable" (click)="openItem(sidenav, item.value)" class="startup-item">
                <h3 md-line class="title"> {{item.value.name}} </h3>
                <p md-line class="description" *ngIf="item.value.description"> {{item.value.description}} </p>
                <p md-line class="category"> {{item.value.meta.categories}} </p>
              </md-list-item>
            </md-list>

            <pagination *ngIf="!loading" [total]="total" [max]="params.max" [offset]="params.offset" (onParamsChange)="paginate($event)"></pagination>

          </div>
        </div>
      </section>

    <md-sidenav-layout>
  `
})
export class Main {

  static get parameters(){
    return [OrganisationService, Router, RouteSegment]
  }

  constructor(organisationService, router, routeSegment){
    this.organisationService = organisationService
    this.router = router
    this.routeSegment = routeSegment
    this.params = {}
    this.selected = {}

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
    this.aggregations = results.aggregations || new Aggregations()
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
      this.organisationService.list(params)
        .subscribe(
          results => this.setItems(results),
          error => this.setError(error)
        )
    }, 300)
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

  openItem(sidenav, item){
    this.selected = item
    sidenav.open()
    console.debug('item', item)
  }

}
