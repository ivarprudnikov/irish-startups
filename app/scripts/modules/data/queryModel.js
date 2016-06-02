export class Query {

  constructor(params){
    if(!params){
      params = {}
    }

    if('string' === typeof params.query){
      this.query = params.query.trim()
    }

    this.categories = Object.keys(params)
      .filter(k => k.match(/^category:/) && params[k])
      .map(k => k.split(':')[1])

    if(!this.categories) this.categories = [];

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
