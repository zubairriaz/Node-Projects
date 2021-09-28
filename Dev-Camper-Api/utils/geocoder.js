const NodeGeocoder = require('node-geocoder');
 
const options = {
  provider: 'mapquest',
 
  // Optional depending on the providers
  httpAdapter: 'https',
  apiKey: process.env.Consumer_Key, // for Mapquest, OpenCage, Google Premier
  formatter: null // 'gpx', 'string', ...
};
console.log(options)
const geocoder = NodeGeocoder(options);

module.exports = geocoder;