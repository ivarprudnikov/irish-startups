import { Component } from '@angular/core';

@Component({
  selector: 'startup',
  inputs: ['type', 'details'],
  template: `
    <section class="startup-item">
      <p class="title">{{details.value.name}}</p>
      <p class="description" *ngIf="details.value.description">{{details.value.description}}</p>
      <p class="category">{{details.value.category}}</p>
    </section>
  `
})
export class StartupDirective {

  constructor(){
  }

  ngOnInit() {
  }

}
