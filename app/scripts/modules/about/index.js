import { Component } from '@angular/core';

@Component({
  selector: 'about-section',
  directives: [ ],
  pipes: [ ],
  template: `
    <div class="container">
      <h1>About </h1>
      <p class="lead">Startups and companies related to their existence</p>
    </div>
  `
})
export class About {

  static get parameters(){
    return []
  }

  constructor(){
  }

}
