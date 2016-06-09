const uuid = require('node-uuid')

module.exports = class Organisation {

  parseUrl(val){
    return val
  }

  constructor(source){

    this.id = source.id || uuid.v4()

    this.name = source.name

    if(source.description)
      this.description = source.description

    if(source.url)
      this.url = this.parseUrl(source.url)

    if(source.meta)
      this.meta = new MetaInformation(source.meta)

    if(source.social)
      this.social = new Social(source.social)

    if(source.address)
      this.address = new Address(source.address.formatted)

    if(source.location)
      this.location = new Location(source.location.lat, source.location.lon)
  }

}

class Social {
  constructor(source){
    source = source || {}
    this.twitter = new SocialTwitter(source.twitter)
  }
}

class SocialTwitter {
  constructor(source){
    source = source || {}
    if(source.handle)
      this.handle = source.handle
  }
}

class MetaInformation {
  constructor(source){
    this.tags = source.tags || []
    this.categories = source.categories || []
    this.sectors = source.sectors || []
  }
}

class Location {
  constructor(lat, lon){
    if(lat != null && lon != null){
      this.lat = lat
      this.lon = lon
    }
  }
}

class Address {
  constructor(formatted){
    if(formatted)
      this.formatted = formatted
  }
}
