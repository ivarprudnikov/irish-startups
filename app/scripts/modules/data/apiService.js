import { Http } from '@angular/http'
import { Injectable } from '@angular/core';
import { map } from 'rxjs/add/operator/map';
import { catch } from 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable'

@Injectable()
export class ApiService {

  static get parameters(){
    return [Http]
  }

  constructor(http){
    this.http = http
    this.cache = {}
  }

  getJson(path){

    let CACHE_KEY = encodeURIComponent(path);

    if(this.cache.hasOwnProperty(CACHE_KEY)){
      return new Observable(obs =>  obs.next(this.cache[CACHE_KEY]))
    }

    return new Observable(obs => {
      this.http.get( path )
        .map(this.parseResponse)
        .catch(this.handleError)
        .subscribe(data => {
          this.cachedResponse = data;
          obs.next(this.cachedResponse)
        })
    })
  }

  update(path, id, data){
    let CACHE_KEY = encodeURIComponent(path);
    this.cache[CACHE_KEY] = this.cache[CACHE_KEY] || {};
    this.cache[CACHE_KEY][id] = data;
  }

  parseResponse(res) {
    if (res.status < 200 || res.status >= 300) {
      throw new Error('Bad response status: ' + res.status);
    }
    let body = res.json() || {};
    this.cachedResponse = body;
    return body
  }

  handleError(error) {
    // In a real world app, we might send the error to remote logging infrastructure
    let errMsg = error.message || 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }

}



