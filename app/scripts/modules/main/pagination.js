import { Component } from '@angular/core';
import { EventEmitter } from '@angular/common/src/facade/async'
import { CORE_DIRECTIVES } from '@angular/common'
import { MdButton } from '@angular2-material/button';

@Component({
  selector: 'pagination',
  directives: [ CORE_DIRECTIVES, MdButton ],
  inputs: [ 'total', 'max', 'offset' ],
  outputs: [ 'onParamsChange' ],
  template: `
    <nav class="pagination">
      <button md-button [disabled]="!(_offset > 0)" (click)="onFirst($event)">First</button>
      <button md-button [disabled]="!(_offset > 0)" (click)="onPrev($event)">Prev</button>
      <button md-button disabled>Offset ({{_offset}}) Page({{currentPage}}) Pages({{pages.length}})</button>
      <button md-button [disabled]="!(_total > (_max + _offset))" (click)="onNext($event)">Next</button>
      <button md-button [disabled]="!(_total > (_max + _offset))" (click)="onLast($event)">Last</button>
    </nav>
  `
})
export class PaginationDirective {

  constructor() {
    this.onParamsChange = new EventEmitter(false);
    this._max = 0
    this._offset = 0
    this._total = 0
    this.currentPage = 1;
    this.pages = [];
  }

  set offset(val){
    this._offset = val
    this.formatInputs()
    this.calculatePages()
  }

  set max(val){
    this._max = val
    this.formatInputs()
    this.calculatePages()
  }

  set total(val){
    this._total = val
    this.formatInputs()
    this.calculatePages()
  }

  ngOnInit() {
    this.formatInputs()
    this.calculatePages()
  }

  castToNumber(val){
    let parsed = parseInt(val, 10)
    if(!isNaN(parsed)){
      return parsed
    }
  }

  formatInputs(){
    let offset = this.castToNumber(this._offset);
    this._offset = offset > 0 ? offset : 0;
    let max = this.castToNumber(this._max);
    this._max = max > 0 ? max : 10;
    let total = this.castToNumber(this._total);
    this._total = total > 0 ? total : 0;
  }

  calculatePages(){
    this.pages = [];

    if(this._total > 0){
      let numberOfPages = Math.floor( this._total / this._max );
      if(this._total % this._max > 0){
        numberOfPages += 1
      }
      do {
        let page = {
          number: numberOfPages,
          starts: (numberOfPages - 1) * this._max,
          ends: numberOfPages * this._max
        }
        this.pages.push(page)
        if(this._offset >= page.starts && this._offset < page.ends){
          this.currentPage = page.number
        }
        --numberOfPages;
      } while (numberOfPages > 0)
      this.pages.reverse()
    }
  }

  emitParams(){
    this.onParamsChange.emit({
      max: this._max,
      offset: this._offset
    });
  }

  onFirst(){
    this._offset = 0
    this.calculatePages()
    this.emitParams()
  }

  onPrev(){
    let offset = this._offset - this._max
    this._offset = offset > 0 ? offset : 0;
    this.calculatePages();
    this.emitParams()
  }

  onNext(){
    this._offset += this._max
    this.calculatePages();
    this.emitParams()
  }

  onLast(){
    let lastPageItems = this._total % this._max
    if(lastPageItems > 0){
      this._offset = this._total - lastPageItems
    } else {
      this._offset = this._total - this._max
    }
    this.calculatePages()
    this.emitParams()
  }
}
