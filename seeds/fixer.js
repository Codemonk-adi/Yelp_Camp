const fs = require('fs');

var name = 'cities_ind.json';
var dataset= JSON.parse(fs.readFileSync(name).toString());
dataset.forEach(function(entry){
    entry.city = entry.city.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    // delete entry.capital;
    // delete entry.admin_name;
});
fs.writeFileSync(name, JSON.stringify(dataset));

// console.log(dataset.length);

