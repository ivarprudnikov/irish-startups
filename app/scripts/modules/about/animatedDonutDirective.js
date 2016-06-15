import { Component } from '@angular/core';
import { DomSanitizationService } from '@angular/platform-browser';

@Component({
  selector: 'animated-donut',
  directives: [],
  inputs: ['val', 'name'],
  styles: [`
    :host {
      display: inline-block
    }
    .animated-donut-wrapper {
      position: relative;
      width: 200px;
      height: 200px;
      display: block;
      background-color: currentcolor;
      border-radius: 50%;
    }
    .val,
    .name {
      display: block;
      width: 100%;
      text-align: center;
      position: absolute;
      z-index: 400;
      font-weight: bold;
      line-height: 1;
    }
    .val {
      top: 50%;
      font-size: 50px;
      margin-top: -35px;
    }
    .name {
      top: 50%;
      font-size: 16px;
      margin-top: 15px;
    }
    .pie {
      display: block;
      width: 50%;
      height: 100%;
      position: absolute;
      background: #2c3e50;
      border: 10px solid;
    }
    .spinner {
      border-radius: 125px 0 0 125px;
      z-index: 200;
      border-right: none;
      transform-origin: center right;
      transform: rotate(0deg);
    }
    .filler {
      border-radius: 0 125px 125px 0;
      z-index: 100;
      border-left: none;
      left: 50%;
      opacity: 0;
      transform-origin: center left;
    }
    .mask {
      display: block;
      width: 50%;
      height: 100%;
      position: absolute;
      z-index: 300;
      opacity: 1;
      border-radius: 125px 0 0 125px;
      background: inherit;
    }
  `],
  template: `
    <span class="animated-donut-wrapper">
      <span class="val">{{val}}</span>
      <span class="name">{{name}}</span>
      <span class="pie spinner" [style.transform]="css.spinnerTransform"></span>
      <span class="pie filler" [style.opacity]="css.fillerOpacity"></span>
      <span class="mask" [style.opacity]="css.maskOpacity"></span>
    </span>
  `
})
export class AnimatedDonutDirective {

  static get parameters() {
    return [DomSanitizationService]
  }

  setSpinDegrees(deg){
    this.css.spinnerDegrees = deg
    this.css.spinnerTransform = this.sanitizer.bypassSecurityTrustStyle(`rotate(${deg}deg)`)
  }

  constructor(sanitizer) {

    this.val = null
    this.name = null
    this.animationLength = 500
    this.animationInterval = 5
    this.sanitizer = sanitizer
    this.css = {
      spinnerDegrees: 0,
      spinnerTransform: null,
      fillerOpacity: 0,
      maskOpacity: 1
    }
    this.setSpinDegrees(0)

  }

  ngOnInit(){
    let interval = setInterval(() => {

      let deg = this.css.spinnerDegrees
      if(deg >= 360){
        clearInterval(interval)
        this.setSpinDegrees( 360 )
        return
      }

      if(deg >= 180){
        this.css.fillerOpacity = 1
        this.css.maskOpacity = 0
      }

      let moveBy = 360 / ( this.animationLength / this.animationInterval )

      this.setSpinDegrees( this.css.spinnerDegrees + moveBy )
    }, this.animationInterval)
  }

}
