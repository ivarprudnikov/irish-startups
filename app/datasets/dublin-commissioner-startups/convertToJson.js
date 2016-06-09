/**
 * Convert csv data to list of normalized Organization objects
 */

var fs = require('fs')
var content = fs.readFileSync('./Dublin-Startups-Pre-Release-ALPHABETICAL.csv', {encoding:'utf8'})
var Organisation = require('../Organisation')

var organisations = content.split('\n')
  .slice(1)
  .map(line => line.split(','))
  .map(values => new Organisation({
    name: values[0],
    url: values[1],
    meta: {
      sectors: [values[2]]
    },
    social: {
      twitter: {
        handle: values[3]
      }
    }
  }))
  .reduce((memo, org, idx, arr) => {
    if(org.name)
      memo[org.id] = org

    return memo
  }, {})

fs.writeFileSync('converted.json', JSON.stringify(organisations), {encoding:'utf8'});

