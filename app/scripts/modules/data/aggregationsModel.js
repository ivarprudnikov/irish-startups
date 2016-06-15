export class Aggregations {
  constructor(categories, categoriesTotal, tags, tagsTotal){
    this.categories = categories || []
    this.categoriesTotal = categoriesTotal || 0
    this.tags = tags || []
    this.tagsTotal = tagsTotal || 0
  }
}
