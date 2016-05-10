import { Http } from '@angular/http'
import { Injectable } from '@angular/core';
import { map } from 'rxjs/add/operator/map';
import { catch } from 'rxjs/add/operator/catch';

@Injectable()
export class Search {

  static get parameters(){
    return [Http]
  }

  constructor(http){
    this.http = http
  }

  list(params){

    // TODO: use query to filter
    let query = new Query(params)

    return this.http.get( document.location.pathname + 'startupireland/converted.json')
      .map(this.extractData)
      .catch(this.handleError);
  }

  extractData(res) {
    if (res.status < 200 || res.status >= 300) {
      throw new Error('Bad response status: ' + res.status);
    }
    let body = res.json();

    return body || { };
  }

  handleError(error) {
    // In a real world app, we might send the error to remote logging infrastructure
    let errMsg = error.message || 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }

}

class Query {

  constructor(params){
    if(!params){
      params = {}
    }
    this.max = Math.min( Query.asInt(params.max, 10), 100 )
    this.offset = Query.asInt(params.offset, 0)
  }

  static asInt(num, defaultNum){

    let parsed = parseInt(num, 10)

    if(isFinite(parsed)){
      return parsed
    }

    if(Number.isInteger(defaultNum))
      return defaultNum

    return null
  }

}
