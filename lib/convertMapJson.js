var content = require('./mapData.json')
var fs = require('fs')

var places = Object.keys(content.categories)
	.map(cat => content.categories[cat].tags)
	.map(tags => Object.keys(tags).reduce((mem,tag) => mem.concat(tags[tag].places), []))
	.reduce((memo, places) => {
		return memo.concat(places)
	}, [])
	.reduce((memo, place, idx, arr) => {
		memo[place._id] = place

		if(idx === arr.length - 1)
			return Object.keys(memo).map(k => memo[k]);

		return memo
	}, {})

fs.writeFileSync('places.json', JSON.stringify(places), {encoding:'utf8'});

