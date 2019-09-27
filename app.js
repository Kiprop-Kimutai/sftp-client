const fs = require('fs');
const convert = require('xml-js');
let xml = fs.readFileSync('./g2/Identity_full_Organization_20190703_040000.xml', 'utf8');
var result = convert.xml2json(xml, {compact: true, spaces: 4});
console.log(result);