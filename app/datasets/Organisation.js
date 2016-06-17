const uuid = require('node-uuid')

module.exports = class Organisation {

  parseUrl(val){
    let url = (val ? val + '' : '').trim()
    if(url && !url.match(/^(http(s)?:)?\/\//)){
      url = 'http://' + url
    }
    return url
  }

  constructor(source){

    if(!source) source = {};

    this.id = source.id || uuid.v4()

    this.name = source.name

    if(source.description)
      this.description = source.description

    if(source.url)
      this.url = this.parseUrl(source.url)

    this.meta = new MetaInformation(source.meta)
    this.social = new Social(source.social)
    this.address = new Address(source.address)
    this.location = new Location(source.location)
  }

  merge(other){
    if(!this.name) this.name = other.name
    if(!this.description) this.description = other.description
    if(!this.url) this.url = other.url

    if(!this.meta) this.meta = other.meta
    else this.meta.merge(other.meta)

    if(!this.social) this.social = other.social
    else this.social.merge(other.social)

    if(!this.address) this.address = other.address
    else this.address.merge(other.address)

    if(!this.location) this.location = other.location
    else this.location.merge(other.location)

    return this
  }

}

class Social {
  constructor(source){
    source = source || {}
    this.twitter = new SocialTwitter(source.twitter)
  }
  merge(other){
    if(!this.twitter) this.twitter = new SocialTwitter(other.twitter)
    else this.twitter.merge(other.twitter)
    return this
  }
}

class SocialTwitter {
  constructor(source){
    source = source || {}
    if(source.handle)
      this.handle = source.handle
  }
  merge(other){
    if(!this.handle) this.handle = other.handle
    return this
  }
}

class MetaInformation {
  constructor(source){
    this.tags = (source && source.tags) || []
    this.categories = (source && source.categories) || []
    this.sectors = (source && source.sectors) || []
  }
  mergeArrayProperty(prop, val){
    if(!this[prop]) this[prop] = []
    if(!val) val = []
    let uniqueMap = {}
    this[prop].forEach( t => uniqueMap[t.trim().toLowerCase()] = t.trim() )
    val.forEach( t => uniqueMap[t.trim().toLowerCase()] = t.trim() )
    this[prop] = Object.keys(uniqueMap).map(k => uniqueMap[k])
  }
  merge(other){
    this.mergeArrayProperty('tags', other.tags)
    this.mergeArrayProperty('categories', other.tags)
    this.mergeArrayProperty('sectors', other.tags)
    return this
  }
}

class Location {
  constructor(obj){
    if(obj && obj.lat != null && obj.lon != null){
      this.lat = obj.lat
      this.lon = obj.lon
    }
  }
  merge(other){
    if((this.lat == null || this.lon == null) && other.lat != null && other.lon != null){
      this.lat = other.lat
      this.lon = other.lon
    }
    return this
  }
}

class Address {
  constructor(obj){
    if(obj && obj.formatted)
      this.formatted = obj.formatted
  }
  merge(other) {
    if (!this.formatted) this.formatted = other.formatted
    return this
  }
}
