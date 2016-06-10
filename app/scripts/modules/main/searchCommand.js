import { FORM_DIRECTIVES, Validators, ControlGroup, Control } from '@angular/common';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { Component } from '@angular/core';
import { MdButton } from '@angular2-material/button';
import { MdCheckbox } from '@angular2-material/checkbox';
import { MD_PROGRESS_CIRCLE_DIRECTIVES } from '@angular2-material/progress-circle';
import { EventEmitter } from '@angular/common/src/facade/async'
import { Aggregations } from '../data/aggregationsModel'

@Component({
  selector: 'search-command',
  directives: [ MdButton, MdCheckbox, MD_INPUT_DIRECTIVES, FORM_DIRECTIVES, MD_PROGRESS_CIRCLE_DIRECTIVES ],
  inputs: [ 'aggregations' ],
  outputs: [ 'onParamsChange' ],
  template: `
    <form [ngFormModel]="searchForm" (ngSubmit)="onFormSubmit()">
      <p>
        <md-input placeholder="Search query ..." ngControl="query"></md-input>
      </p>

      <fieldset>

        <legend>Categories</legend>

        <template ngFor let-cat [ngForOf]="_aggregations.categories" let-i="index">
          <p *ngIf="i < 5 || showMoreCategories">
            <md-checkbox ngControl="{{ cat.controlName }}" [disabled]="cat.disabled && !searchForm.value[cat.controlName]">
              {{ cat.name }} <span *ngIf="!isLoading">({{ cat.count }})</span> <md-spinner *ngIf="isLoading"></md-spinner>
            </md-checkbox>
          </p>
        </template>

        <a href="javascript:void(0)" *ngIf="!showMoreCategories && _aggregations.categories.length" (click)="showMoreCategories=true">More categories ({{_aggregations.categories.length}}) ...</a>
      </fieldset>

      <fieldset>

        <legend>Tags</legend>

        <template ngFor let-tag [ngForOf]="_aggregations.tags" let-i="index">
          <p *ngIf="i < 5 || showMoreTags">
            <md-checkbox ngControl="{{ tag.controlName }}" [disabled]="tag.disabled && !searchForm.value[tag.controlName]">
              {{ tag.name }} <span *ngIf="!isLoading">({{ tag.count }})</span> <md-spinner *ngIf="isLoading"></md-spinner>
            </md-checkbox>
          </p>
        </template>

        <a href="javascript:void(0)" *ngIf="!showMoreTags && _aggregations.tags.length" (click)="showMoreTags=true">More tags ({{_aggregations.tags.length}}) ...</a>

      </fieldset>

      <br>

      <button type="submit" md-raised-button="" color="primary">Search</button>
    </form>
  `
})
export class SearchCommandDirective {

  constructor(){
    this.params = {}
    this._aggregations = new Aggregations();
    this.onParamsChange = new EventEmitter(false);

    this.searchForm = new ControlGroup({
      query: new Control("")
    })

    this.searchForm.valueChanges.subscribe(val => {
      this.emitParams(val)
    })
  }

  set aggregations(val){

    if(!this._aggregations){
      this._aggregations = new Aggregations()
    }

    if(!val){
      this.isLoading = true
      val = new Aggregations()
    } else {
      this.isLoading = false
    }

    ['categories', 'tags'].forEach(aggregationType => {

      val[aggregationType].forEach(newAgg => {

        newAgg.controlName = newAgg.type + ':' + newAgg.name

        let alreadyExisting = this._aggregations[aggregationType]
          .filter(existingAgg => existingAgg.name === newAgg.name)[0]

        if(!alreadyExisting){
          this._aggregations[aggregationType].push(newAgg)
          this.searchForm.addControl(newAgg.controlName, new Control(""))
        } else {
          alreadyExisting.count = newAgg.count
        }
      })

      this._aggregations[aggregationType].forEach(existingAgg => {
        let inNewList = val[aggregationType].filter(newAgg => existingAgg.name === newAgg.name)[0]
        if(!inNewList){
          existingAgg.count = 0
        }
      })
    })

  }

  onFormSubmit(){
    this.emitParams(this.searchForm.value)
  }

  emitParams(data){
    Object.keys(data).forEach(k => this.params[k] = data[k])
    this.onParamsChange.emit(this.params);
  }

}
