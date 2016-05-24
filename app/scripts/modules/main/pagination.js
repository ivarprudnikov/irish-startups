import { Component } from '@angular/core';
import { EventEmitter } from '@angular/common/src/facade/async'
import { CORE_DIRECTIVES } from '@angular/common'

@Component({
  selector: 'pagination',
  directives: [ CORE_DIRECTIVES ],
  inputs: [ 'total', 'max', 'offset' ],
  outputs: [ 'onParamsChange' ],
  template: `
    <nav class="pagination">
      <button (click)="onPrev($event)" *ngIf="offset > 0">Prev</button>
      <button (click)="onNext($event)" *ngIf="total > (max + offset)">Next</button>
    </nav>
  `
})
export class PaginationDirective {

  constructor() {
    this.onParamsChange = new EventEmitter(false);
    this.max = 0
    this.offset = 0
    this.total = 0
  }

  ngOnInit() {
    console.debug('max', this.max, 'offset', this.offset, 'total', this.total)
    this.formatInputs()
  }

  castToNumber(val){
    let parsed = parseInt(val, 10)
    if(!isNaN(parsed)){
      return parsed
    }
  }

  formatInputs(){
    let offset = this.castToNumber(this.offset);
    this.offset = offset > 0 ? offset : 0;
    let max = this.castToNumber(this.max);
    this.max = max > 0 ? max : 10;
    let total = this.castToNumber(this.total);
    this.total = total > 0 ? total : 0;
  }

  onPrev(){
    this.formatInputs()
    let offset = this.offset - this.max
    this.offset = offset > 0 ? offset : 0;
    this.onParamsChange.emit({
      max: this.max,
      offset: this.offset
    });
  }

  onNext(){
    this.formatInputs()
    this.offset += this.max
    this.onParamsChange.emit({
      max: this.max,
      offset: this.offset
    });
  }
}
