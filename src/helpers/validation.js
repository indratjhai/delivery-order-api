const check = require('check-types');

const isValidLatitude = (lat) => Number.isFinite(Number(lat)) && Math.abs(lat) <= 90;

const isValidLongitude = (lng) => Number.isFinite(Number(lng)) && Math.abs(lng) <= 180;

const isValidLatLongPair = (pair) => check.array(pair)
    && check.hasLength(pair, 2)
    && check.array.of.string(pair)
    && isValidLatitude(pair[0])
    && isValidLongitude(pair[1]);

const isIntegerString = (int) => /^[\d-]+$/.test(int);

module.exports = {
  isValidLatLongPair, isIntegerString, isValidLatitude, isValidLongitude,
};
