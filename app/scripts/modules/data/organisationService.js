import { Injectable } from '@angular/core';
import { map } from 'rxjs/add/operator/map';
import { Results } from './resultsModel'
import { Query } from './queryModel'
import { ApiService } from './apiService'

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

  filterByQuery(body, query) {
    let allKeys = Object.keys(body);
    let searchResultCategories = {}

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

    allKeys.forEach(k => {
      let cat = body[k].meta.categories
      if(cat && cat.length){
        cat.forEach(c => {
          let cachedCat = searchResultCategories[c]
          if(cachedCat){
            searchResultCategories[c] += 1
          } else {
            searchResultCategories[c] = 1
          }
        })
      }
    })

    if(query.categories.length){
      allKeys = allKeys.filter(k => {
        let categories = body[k].meta.categories
        if(!categories && !categories.length)
          return

        let hasMatchingCategory = false
        categories.forEach(c => {
          if(query.categories.indexOf(c) > -1){
            hasMatchingCategory = true
          }
        })
        return hasMatchingCategory
      })
    }

    let filteredItems = allKeys.slice(query.offset, query.offset + query.max).map(k => body[k]);

    return new Results(filteredItems, allKeys.length, searchResultCategories)
  }

}



