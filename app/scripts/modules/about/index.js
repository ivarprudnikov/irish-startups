import { Component } from '@angular/core';
import { OrganisationService } from '../data/organisationService'
import { AnimatedDonutDirective } from './animatedDonutDirective'
import { Aggregations } from '../data/aggregationsModel'
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
  selector: 'about-section',
  directives: [ ROUTER_DIRECTIVES, AnimatedDonutDirective ],
  pipes: [ ],
  template: `
    <div class="container text-center">
      <h1>About </h1>
      <p class="lead">Startups and companies related to their existence. In Ireland.</p>
      <div class="row aggregations">
        <div class="col-sm-4 text-center">
          <animated-donut [val]="organisations" [name]="'Organisations'"></animated-donut>
        </div>
        <div class="col-sm-4 text-center">
          <animated-donut [val]="tags" [name]="'Tags'"></animated-donut>
        </div>
        <div class="col-sm-4 text-center">
          <animated-donut [val]="categories" [name]="'Categories'"></animated-donut>
        </div>
      </div>

      <a [routerLink]="['/main']" class="btn btn-bordered-white btn-lg">Search & Filter</a>
    </div>
  `
})
export class About {

  static get parameters(){
    return [OrganisationService]
  }

  constructor(organisationService){
    this.organisationService = organisationService
    this.organisationService.list()
      .subscribe(results => this.setItems(results))

    this.organisations = 0
    this.tags = 0
    this.categories = 0

    this.list()
  }

  setItems(results){
    results = results || {};
    this.organisations = results.total || this.items.length
    let aggs = results.aggregations || new Aggregations()
    this.categories = aggs.categoriesTotal
    this.tags = aggs.tagsTotal
  }

  list(params){
      this.organisationService.list(params)
        .subscribe( results => this.setItems(results))
  }

}
