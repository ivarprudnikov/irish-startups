import { Http } from '@angular/http'
import { Injectable } from '@angular/core';
import { map } from 'rxjs/add/operator/map';
import { catch } from 'rxjs/add/operator/catch';
import { share } from 'rxjs/add/operator/share';
import { Observable } from 'rxjs/Observable'

@Injectable()
export class Search {

  static get parameters(){
    return [Http]
  }

  constructor(http){
    this.http = http
  }

  asObservable(data){
    return new Observable(obs =>  obs.next(data))
  }

  fetchData(){

    if(this.cachedResponse){
      return this.asObservable(this.cachedResponse)
    }

    return new Observable(obs => {
      this.http.get( document.location.pathname + 'startupireland/converted.json')
        .map(this.parseResponse)
        .catch(this.handleError)
        .subscribe(data => {
          this.cachedResponse = data;
          obs.next(this.cachedResponse)
        })
    })
  }

  parseResponse(res) {
    if (res.status < 200 || res.status >= 300) {
      throw new Error('Bad response status: ' + res.status);
    }
    let body = res.json() || {};
    this.cachedResponse = body;
    return body
  }

  list(params){
    let query = new Query(params)
    return this.fetchData()
      .map(res => this.extractData(res,query))
      .catch(this.handleError);
  }

  extractData(body, query) {
    let allKeys = Object.keys(body);

    if(query.query){
      let queryMatcher = new RegExp(query.query, "gi");
      allKeys = allKeys.filter(k => {
        let titleMatches = (function(){
          return body[k].title && body[k].title.match(queryMatcher)
        }())
        let descriptionMatches = (function(){
          return body[k].description && body[k].description.match(queryMatcher)
        }())
        return titleMatches || descriptionMatches
      })
    }

    let filteredItems = allKeys.slice(query.offset, query.offset + query.max).map(k => body[k]);
    return new Results(filteredItems, allKeys.length)
  }

  handleError(error) {
    // In a real world app, we might send the error to remote logging infrastructure
    let errMsg = error.message || 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }

}

class Results {
  constructor(items, total){
    this.items = items
    this.total = total
  }
}

class Query {

  constructor(params){
    if(!params){
      params = {}
    }

    if('string' === typeof params.query){
      this.query = params.query.trim()
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
