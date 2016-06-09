var fs = require('fs')
var Organisation = require('../Organisation')

var sourceFolders = [
  'startupireland',
  'dublin-commissioner-startups'
]

var mergedBlob = sourceFolders.map(name => require(`../${name}/converted.json`))
  .reduce((memo, dataset, idx, arr) => {
    Object.keys(dataset).forEach(k => memo[k] = dataset[k])
    return memo
  }, {})

var allOrganisations = Object.keys(mergedBlob)
  .map(k => new Organisation(mergedBlob[k]))

var mapOfMergedOrganisations = allOrganisations
  .reduce((memo, org, idx, arr) => {

    let nameKey = org.name.trim().toLowerCase().replace(/\W+/gi,'-');

    let existing = memo[nameKey]
    if(!existing)
      memo[nameKey] = org
    else
      memo[nameKey] = existing.merge(org)

    return memo
  }, {})

fs.writeFileSync('converted.json', JSON.stringify(mapOfMergedOrganisations, null, '  '), {encoding:'utf8'});
