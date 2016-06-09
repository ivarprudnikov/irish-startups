var content = require('./source.json')
var fs = require('fs')
var Organisation = require('../Organisation')

function convert(place){

  let params = {
    meta: {}
  }

  params.id = place._id

  if(place.companyName) { params.name = place.companyName }

  if(place.description) { params.description = place.description }

  if(place.websiteURL) { params.url = place.websiteURL }

  if(place.lat != null && place.lon != null){
    params.location = {
      lat: place.lat,
      lon: place.lon
    }
  }

  let tags = place.companyTags.filter(t => t !== "general");
  if(tags.length){ params.meta.tags = tags; }

  if(place.companyCategory) { params.meta.categories = [place.companyCategory] }

  if(place.addressDisplay) { params.address = { formatted: place.addressDisplay } }

  return new Organisation(params);
}

var places = Object.keys(content.categories)
	.map(cat => content.categories[cat].tags)
	.map(tags => Object.keys(tags).reduce((mem,tag) => mem.concat(tags[tag].places), []))
	.reduce((memo, places) => {
		return memo.concat(places)
	}, [])
	.reduce((memo, place, idx, arr) => {

    let organisation = convert(place)

		memo[organisation.id] = organisation
		return memo
	}, {})

fs.writeFileSync('converted.json', JSON.stringify(places), {encoding:'utf8'});

