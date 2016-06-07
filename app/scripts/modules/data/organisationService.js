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
    this.jsonPath = document.location.pathname + 'startupireland/converted.json'
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
          return body[k].title && body[k].title.match(queryMatcher)
        }())
        let descriptionMatches = (function(){
          return body[k].description && body[k].description.match(queryMatcher)
        }())
        return titleMatches || descriptionMatches
      })
    }

    allKeys.forEach(k => {
      let cat = body[k].category
      if(cat){
        let cachedCat = searchResultCategories[cat]
        if(cachedCat){
          searchResultCategories[cat] += 1
        } else {
          searchResultCategories[cat] = 1
        }
      }
    })

    if(query.categories.length){
      allKeys = allKeys.filter(k => {
        return query.categories.indexOf(body[k].category) > -1
      })
    }

    let filteredItems = allKeys.slice(query.offset, query.offset + query.max).map(k => {
      let item = body[k]
      item._id = k
      return item
    });

    return new Results(filteredItems, allKeys.length, searchResultCategories)
  }

}



