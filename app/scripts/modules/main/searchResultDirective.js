import { Component } from '@angular/core';
import { MdButton } from '@angular2-material/button';
import { MdProgressBar } from '@angular2-material/progress-bar';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { FORM_DIRECTIVES, FormBuilder, Validators } from '@angular/common';
import { OrganisationService } from '../data/organisationService'

@Component({
  selector: 'search-result',
  directives: [ MdButton, MdProgressBar, MD_INPUT_DIRECTIVES, FORM_DIRECTIVES ],
  inputs: ['item'],
  template: `
    <article class="container-sidenav container-fluid">

      <header>
        <button type="button" md-raised-button (click)="toggleEdit()">{{ editing ? 'Back to preview' : 'Edit' }}</button>
      </header>

      <section>
        <div *ngIf="!editing">
          <h2>{{ item.name }}</h2>
          <p *ngIf="item.url"><a target="_blank" href="{{ item.url }}">{{ item.url }}</a></p>
          <p *ngIf="item.categoty">Category: {{ item.categoty }}</p>
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
        </div>
        <form *ngIf="editing" [ngFormModel]="itemForm">
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
            <md-input placeholder="Category" ngControl='category' [(ngModel)]="item.category"></md-input>
          </p>
          <p>
            <md-input placeholder="Address" ngControl='address' [(ngModel)]="item.address.formatted"></md-input>
          </p>
        </form>
      </section>

    </article>
  `
})
export class SearchResultDirective {

  static get parameters(){
    return [FormBuilder, OrganisationService]
  }

  constructor(FormBuilder, OrganisationService){
    this.organisationService = OrganisationService
    this.item = {}
    this.itemForm = FormBuilder.group({
      name: ["", Validators.required],
      url: ["", Validators.required],
      description: ["", Validators.required],
      category: ["", Validators.required],
      address: ["", Validators.required]
    });

    this.itemForm.valueChanges.subscribe(val => {
      if(this.itemForm.valid) this.storeItem()
    })
  }

  storeItem(){
    if(this.itemForm.valid){
      this.organisationService.update(this.item._id, this.item)
    }
  }

  toggleEdit(){
    this.editing = !this.editing
  }
}
