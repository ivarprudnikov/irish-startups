import { Routes } from '@angular/router';
import { Component } from '@angular/core';
import { MdButton } from '@angular2-material/button';
import { MD_SIDENAV_DIRECTIVES } from '@angular2-material/sidenav';

@Component({
  selector: 'main-section',
  directives: [ MdButton, MD_SIDENAV_DIRECTIVES ],
  template: `
  <md-sidenav-layout class="demo-sidenav-layout">
    <md-sidenav #start (open)="myinput.focus()" mode="side">
      Start Side Drawer
      <br>
      <button md-button (click)="start.close()">Close</button>
      <br>
      <button md-button (click)="end.open()">Open End Side</button>
      <br>
      <button md-button
              (click)="start.mode = (start.mode == 'push' ? 'over' : (start.mode == 'over' ? 'side' : 'push'))">Toggle Mode</button>
      <div>Mode: {{start.mode}}</div>
      <br>
      <input #myinput>
    </md-sidenav>

    <md-sidenav #end align="end">
      End Side Drawer
      <br>
      <button md-button (click)="end.close()">Close</button>
    </md-sidenav>

    <div class="demo-sidenav-content">
      <h1>My Content</h1>

      <div>
        <header>Sidenav</header>
        <button md-button (click)="start.toggle()">Toggle Start Side Drawer</button>
        <button md-button (click)="end.toggle()">Toggle End Side Drawer</button>
      </div>

      <button md-button>HELLO</button>
      <button md-raised-button class="md-primary">HELLO</button>
      <button md-fab class="md-accent">HI</button>
    </div>
  </md-sidenav-layout>

  <section class="container"><h1>Main component</h1></section>`
})
export class Main {



  constructor(){
  }
}
