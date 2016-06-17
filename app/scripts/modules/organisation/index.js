import { Routes, Router, RouteSegment } from '@angular/router';
import { Component } from '@angular/core';
import { MdProgressBar } from '@angular2-material/progress-bar';
import { OrganisationService } from '../data/organisationService'
import { MapToIterablePipe } from '../util/mapToIterablePipe'
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { FORM_DIRECTIVES, FormBuilder, Validators } from '@angular/common';

let Organisation = require('../../../datasets/Organisation')

@Component({
  selector: 'organisation-show',
  directives: [ MdProgressBar, MD_INPUT_DIRECTIVES, FORM_DIRECTIVES ],
  pipes: [ MapToIterablePipe ],
  template: `
    <article class="container">

      <md-progress-bar *ngIf="loading" mode="indeterminate"></md-progress-bar>

      <h3 *ngIf="item === null">Nothing found</h3>

      <section *ngIf="item" class="col-sm-6">
        <h2>{{ item.name }}</h2>
        <p *ngIf="item.url"><a target="_blank" href="{{ item.url }}">{{ item.url }}</a></p>
        <p *ngIf="item.meta && item.meta.categories">Categories: {{ item.meta.categories }}</p>
        <p *ngIf="item.meta && item.meta.tags">Tags: {{ item.meta.tags }}</p>
        <p *ngIf="item.description">{{ item.description }}</p>
        <div *ngIf="item.location">
          <p>
            <img class="img-responsive img-rounded"
                 src="https://maps.googleapis.com/maps/api/staticmap?center={{item.location.lat}},{{item.location.lon}}&zoom=12&size=600x300&maptype=roadmap&markers=color:blue%7C{{item.location.lat}},{{item.location.lon}}" />
          </p>
          <ul class="list-group">
            <li class="list-group-item"><a href="http://maps.apple.com/?z=12&q={{item.location.lat}},{{item.location.lon}}">Show in Apple maps</a></li>
            <li class="list-group-item"><a href="https://google.com/maps/place/{{item.location.lat}},{{item.location.lon}}">Show in Google maps</a></li>
            <li class="list-group-item"><a href="http://www.openstreetmap.org/?mlat={{item.location.lat}}&mlon={{item.location.lon}}">Show in Open Street maps</a></li>
          </ul>
        </div>
      </section>

      <section *ngIf="item" class="col-sm-6">
        <form [ngFormModel]="itemForm">
          <p>
            <md-input placeholder="Name" ngControl='name' [(ngModel)]="item.name"></md-input>
          </p>
          <p>
            <md-input placeholder="URL" ngControl='url' [(ngModel)]="item.url"></md-input>
          </p>
          <p>
            <md-input placeholder="Description" ngControl='description' [(ngModel)]="item.description"></md-input>
          </p>
          <p>
            <md-input placeholder="Address" ngControl='address' [(ngModel)]="item.address.formatted"></md-input>
          </p>
        </form>
      </section>

    </article>
  `
})
export class OrganisationCmp {

  static get parameters(){
    return [OrganisationService, Router, RouteSegment, FormBuilder]
  }

  constructor(organisationService, router, routeSegment, FormBuilder){
    this.organisationService = organisationService
    this.router = router
    this.routeSegment = routeSegment
    this.item = new Organisation()
    this.itemForm = FormBuilder.group({
      name: ["", Validators.required],
      url: ["", Validators.required],
      description: ["", Validators.required],
      address: ["", Validators.required]
    });

    this.itemForm.valueChanges.subscribe(val => {
      if(this.itemForm.valid) this.storeItem()
    })

    console.debug('routeSegment.parameters', routeSegment.parameters)

    this.getOne(routeSegment.parameters.id)
  }

  getOne(id){
    this.setLoader(true)

    setTimeout(() => {
      this.organisationService.findOne(id)
        .subscribe(result => this.setItem(result))
    }, 300)
  }

  storeItem(){
    if(this.itemForm.valid){
      this.organisationService.update(this.item.id, this.item)
    }
  }

  setLoader(isLoading){
    this.loading = isLoading
  }

  setItem(result){
    this.item = result || new Organisation();
    this.setLoader(false)
  }

}
