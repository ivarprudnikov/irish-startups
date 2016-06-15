import { Injectable } from '@angular/core';
import { map } from 'rxjs/add/operator/map';
import { Results } from './resultsModel'
import { Query } from './queryModel'
import { ApiService } from './apiService'
import { Aggregation } from './aggregationModel'
import { Aggregations } from './aggregationsModel'

@Injectable()
export class OrganisationService {

  static get parameters(){
    return [ApiService]
  }

  constructor(api){
    this.api = api
    this.jsonPath = document.location.pathname + 'datasets/combined/converted.json'
  }

  /**
   * @returns {Observable}
   */
  list(params){
    let query = new Query(params)
    return this.fetchAll()
      .map(res => this.filterByQuery(res,query))
  }

  /**
   * @returns {Observable}
   */
  findOne(id){
    return this.fetchAll()
      .map(res => res[id])
  }

  save(data){
    let id = new Date().getTime() + '-' + Math.random()
    return this.api.update(this.jsonPath, id, data)
  }

  /**
   * @returns {Observable}
   */
  update(id, data){
    return this.api.update(this.jsonPath, id, data)
  }

  /**
   * @returns {Observable}
   */
  fetchAll(){
    return this.api.getJson(this.jsonPath)
  }

  extractMetaAggregations(searchResponse, type, metaName){
    let allKeys = Object.keys(searchResponse);
    let aggs = {}
    allKeys.forEach(k => {
      let itemMeta = searchResponse[k].meta[metaName]
      if (itemMeta && itemMeta.length) {
        itemMeta.forEach(val => {
          let count = aggs[val]
          if (count) {
            aggs[val] += 1
          } else {
            aggs[val] = 1
          }
        })
      }
    })

    let resp = Object.keys(aggs)
      .map(val => new Aggregation(type, val, aggs[val]))
      .filter(agg => agg.count > 0)
      .sort((a,b) => b.count - a.count)

    return resp;
  }

  extractAggregations(searchResponse){
    let categories = this.extractMetaAggregations(searchResponse, 'category', 'categories')
    let tags = this.extractMetaAggregations(searchResponse, 'tag', 'tags')
    return new Aggregations(categories.slice(0, 15), categories.length, tags.slice(0, 15), tags.length)
  }

  filterByQuery(body, query) {

    let allKeys = Object.keys(body);

    if(query.query){
      let queryMatcher = new RegExp(query.query, "gi");
      allKeys = allKeys.filter(k => {
        let titleMatches = (function(){
          return body[k].name && body[k].name.match(queryMatcher)
        }())
        let descriptionMatches = (function(){
          return body[k].description && body[k].description.match(queryMatcher)
        }())
        return titleMatches || descriptionMatches
      })
    }

    let aggregatableResultSet = allKeys.reduce((memo, key) => {
      memo[key] = body[key];
      return memo;
    }, {})

    let aggregations = this.extractAggregations(aggregatableResultSet);

    ['categories', 'tags'].forEach(aggregationType => {

      if(query[aggregationType].length){
        allKeys = allKeys.filter(k => {
          let metaValues = body[k].meta[aggregationType]
          if(!metaValues && !metaValues.length){
            return false
          }

          let hasMatchingMetaValue = false
          metaValues.forEach(c => {
            if(query[aggregationType].indexOf(c) > -1){
              hasMatchingMetaValue = true
            }
          })
          return hasMatchingMetaValue
        })
      }
    })

    let filteredItems = allKeys.slice(query.offset, query.offset + query.max).map(k => body[k]);

    return new Results(filteredItems, allKeys.length, aggregations)
  }

}



