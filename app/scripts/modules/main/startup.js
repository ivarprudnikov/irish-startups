import { Component } from '@angular/core';

@Component({
  selector: 'startup',
  inputs: ['type', 'details'],
  template: `
    <section>
      <p>{{details.value.name}}</p>
      <p>{{details.value.description}}</p>
      <p>Category: {{details.value.category}}</p>
    </section>
  `
})
export class StartupDirective {

  constructor(){
  }

  ngOnInit() {
  }

}
