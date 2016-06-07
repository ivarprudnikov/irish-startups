var content = require('./source.json')
var fs = require('fs')

var places = Object.keys(content.categories)
	.map(cat => content.categories[cat].tags)
	.map(tags => Object.keys(tags).reduce((mem,tag) => mem.concat(tags[tag].places), []))
	.reduce((memo, places) => {
		return memo.concat(places)
	}, [])
	.reduce((memo, place, idx, arr) => {

    let id = place._id

    // convert location
    let lat = place.lat
    let lon = place.lon
    if(lat != null && lon != null){
      place.location = {
        lat: lat,
        lon: lon
      }
    }

    // convert tags, remove `general` tag
    let tags = place.companyTags.filter(t => t !== "general");
    if(tags.length){ place.tags = tags; }

    // convert url
    let url = place.websiteURL
    if(url) { place.url = url }

    // convert name
    let name = place.companyName
    if(name) { place.name = name }

    // convert category
    let category = place.companyCategory
    if(category) { place.category = category }

    // convert address
    let address = place.addressDisplay
    if(address) { place.address = { formatted: address } }

    // remove unnecessary details
    [
      '_id', 'additionDate', 'hiringPageURL', 'lat', 'lon', 'metaData', 'logoUID', 'companyTags', 'websiteURL',
      'companyName', 'companyCategory', 'addressDisplay'
    ].forEach(k => delete place[k])

    // remove empty values
    Object.keys(place).forEach((k) => {
      if(place[k] === null || place[k] === "" || place[k] === "Please add description"){
        delete place[k]
      }
    })

		memo[id] = place
		return memo
	}, {})

fs.writeFileSync('converted.json', JSON.stringify(places), {encoding:'utf8'});

