import { Routes, Router, RouteSegment } from '@angular/router';
import { Component } from '@angular/core';
import { MdProgressBar } from '@angular2-material/progress-bar';
import { OrganisationService } from '../data/organisationService'
import { MapToIterablePipe } from '../util/mapToIterablePipe'

@Component({
  selector: 'organisation-show',
  directives: [ MdProgressBar ],
  pipes: [ MapToIterablePipe ],
  template: `
    <article class="container">

      <md-progress-bar *ngIf="loading" mode="indeterminate"></md-progress-bar>

      <h3 *ngIf="item === null">Nothing found</h3>

      <section *ngIf="item">
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

    </article>
  `
})
export class Organisation {

  static get parameters(){
    return [OrganisationService, Router, RouteSegment]
  }

  constructor(organisationService, router, routeSegment){
    this.organisationService = organisationService
    this.router = router
    this.routeSegment = routeSegment
    this.item = {}

    console.debug('routeSegment.parameters', routeSegment.parameters)

    this.getOne(routeSegment.parameters.id)
  }

  getOne(id){
    this.setItem({})
    this.setLoader(true)

    setTimeout(() => {
      this.organisationService.findOne(id)
        .subscribe(result => this.setItem(result))
    }, 300)
  }

  setLoader(isLoading){
    this.loading = isLoading
  }

  setItem(result){
    this.item = result || null;
    this.setLoader(false)
  }

}
