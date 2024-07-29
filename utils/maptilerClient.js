const { Geocoding } = require('@maptiler/sdk');

const apiKey = process.env.MAPTILER_API_KEY;
if (!apiKey) {
  throw new Error('MapTiler API key is missing');
}

const geocoding = new Geocoding({ apiKey });

module.exports = { geocoding };