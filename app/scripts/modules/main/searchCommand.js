import { FORM_DIRECTIVES, Validators, ControlGroup, Control } from '@angular/common';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { Component } from '@angular/core';
import { MdButton } from '@angular2-material/button';
import { MdCheckbox } from '@angular2-material/checkbox';
import { MD_PROGRESS_CIRCLE_DIRECTIVES } from '@angular2-material/progress-circle';
import { EventEmitter } from '@angular/common/src/facade/async'

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

        <template ngFor let-cat [ngForOf]="_aggregations" let-i="index">
          <p *ngIf="i < 5 || showMore">
            <md-checkbox ngControl="{{ cat.controlName }}" [disabled]="cat.disabled && !searchForm.value[cat.controlName]">
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

    this.searchForm = new ControlGroup({
      query: new Control("")
    })

    this.searchForm.valueChanges.subscribe(val => {
      this.emitParams(val)
    })
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

      newCat.controlName = 'category:' + newCat.name

      let alreadyExisting = this._aggregations.filter(existingCat => existingCat.name === newCat.name)[0]
      if(!alreadyExisting){
        this._aggregations.push(newCat)
        this.searchForm.addControl(newCat.controlName, new Control(""))
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

  onFormSubmit(){
    this.emitParams(this.searchForm.value)
  }

  emitParams(data){
    Object.keys(data).forEach(k => this.params[k] = data[k])
    this.onParamsChange.emit(this.params);
  }

}
