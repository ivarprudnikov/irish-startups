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
      <button md-button [disabled]="!(offset > 0)" (click)="onPrev($event)">Prev</button>
      <button md-button disabled>{{currentPage}}</button>
      <button md-button [disabled]="!(total > (max + offset))" (click)="onNext($event)">Next</button>
    </nav>
  `
})
export class PaginationDirective {

  constructor() {
    this.onParamsChange = new EventEmitter(false);
    this.max = 0
    this.offset = 0
    this.total = 0
    this.currentPage = 1;
    this.pages = [];
  }

  ngOnInit() {
    console.debug('max', this.max, 'offset', this.offset, 'total', this.total)
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
    let offset = this.castToNumber(this.offset);
    this.offset = offset > 0 ? offset : 0;
    let max = this.castToNumber(this.max);
    this.max = max > 0 ? max : 10;
    let total = this.castToNumber(this.total);
    this.total = total > 0 ? total : 0;
  }

  calculatePages(){
    this.pages = [];

    if(this.total > 0){
      let numberOfPages = Math.floor( this.total / this.max ) + 1;
      do {
        let page = {
          number: numberOfPages,
          starts: (numberOfPages - 1) * this.max,
          ends: numberOfPages * this.max
        }
        this.pages.push(page)
        if(this.offset >= page.starts && this.offset < page.ends){
          this.currentPage = page.number
        }
        --numberOfPages;
      } while (numberOfPages > 0)
      this.pages.reverse()
    }
  }

  onPrev(){
    this.formatInputs()
    let offset = this.offset - this.max
    this.offset = offset > 0 ? offset : 0;
    this.calculatePages();
    this.onParamsChange.emit({
      max: this.max,
      offset: this.offset
    });
  }

  onNext(){
    this.formatInputs()
    this.offset += this.max
    this.calculatePages();
    this.onParamsChange.emit({
      max: this.max,
      offset: this.offset
    });
  }
}
