export class Results {
  constructor(items, total, aggregations){
    this.items = items
    this.total = total
    this.aggregations = aggregations || new Aggregations();
  }
}
