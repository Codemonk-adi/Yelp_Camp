fs = require('fs');
path = require('path')
var names = './cities_ind.json';


var dataset= JSON.parse(fs.readFileSync(path.join(__dirname,names)).toString());

module.exports = dataset;