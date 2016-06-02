import { Aggregation } from './aggregationModel'

export class Results {
  constructor(items, total, categories){
    this.items = items
    this.total = total

    let resultCategories = categories || {}
    this.aggregations = Object.keys(resultCategories)
      .map(k => new Aggregation(k, resultCategories[k]));
  }
}
