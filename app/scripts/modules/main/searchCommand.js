import { FORM_DIRECTIVES } from '@angular/common';
import { Component } from '@angular/core';
import { MdButton } from '@angular2-material/button';
import { MdCheckbox } from '@angular2-material/checkbox';
import { MD_PROGRESS_CIRCLE_DIRECTIVES } from '@angular2-material/progress-circle';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { EventEmitter } from '@angular/common/src/facade/async'

@Component({
  selector: 'search-command',
  directives: [ MdButton, MdCheckbox, MD_INPUT_DIRECTIVES, FORM_DIRECTIVES, MD_PROGRESS_CIRCLE_DIRECTIVES ],
  inputs: [ 'aggregations' ],
  outputs: [ 'onParamsChange' ],
  template: `
    <form #f="ngForm" (ngSubmit)="onFormSubmit(f.value)">
      <p>
        <md-input placeholder="Search query ..." ngControl="query"></md-input>
      </p>
      <fieldset>

        <template ngFor let-cat [ngForOf]="_aggregations" let-i="index">
          <p *ngIf="i < 5 || showMore">
            <md-checkbox ngControl="category:{{ cat.name }}" [disabled]="cat.disabled && !f.value['category:' + cat.name]">
              {{ cat.name }} <span *ngIf="!isLoading">({{ cat.count }})</span> <md-spinner *ngIf="isLoading"></md-spinner>
            </md-checkbox>
          </p>
        </template>

        <a href="javascript:void(0)" *ngIf="!showMore && _aggregations.length" (click)="showMore=true">More aggregations ...</a>
      </fieldset>

      <br>

      <button type="submit" md-raised-button="" color="primary">Search</button>
    </form>
  `
})
export class SearchCommandDirective {

  constructor(){
    this.params = {}
    this._aggregations = [];
    this.onParamsChange = new EventEmitter(false);
  }

  set aggregations(val){

    if(!this._aggregations || !this._aggregations.length){
      this._aggregations = []
    }

    if(!val || !val.length){
      this.isLoading = true
      val = []
    } else {
      this.isLoading = false
    }

    val.forEach(newCat => {
      let alreadyExisting = this._aggregations.filter(existingCat => existingCat.name === newCat.name)[0]
      if(!alreadyExisting){
        this._aggregations.push(newCat)
      } else {
        alreadyExisting.count = newCat.count
        alreadyExisting.disabled = false
      }
    })

    this._aggregations.forEach(existingCat => {
      let inNewList = val.filter(newCat => existingCat.name === newCat.name)[0]
      if(!inNewList){
        existingCat.disabled = true
        existingCat.count = 0
      }
    })

  }

  onFormSubmit(data){
    Object.keys(data).forEach(k => this.params[k] = data[k])
    this.emitParams()
  }

  emitParams(){

    console.debug('emit')

    this.onParamsChange.emit(this.params);
  }

}
