const googleMapsClient = require('@google/maps');

exports.calculateDistance = async (
  origin,
  destination,
  apiKey = process.env.GOOGLE_MAPS_API_KEY,
) => {
  try {
    return await googleMapsClient.createClient({
      key: apiKey,
      Promise,
    }).distanceMatrix({
      origins: [origin],
      destinations: [destination],
    }).asPromise().then((response) => {
      try {
        return response.json.rows[0].elements[0].distance.value; // in meters
      } catch (e) {
        return null;
      }
    });
  } catch (e) {
    // This is to catch plain text thrown by Google Maps API Client.
    // Rethrow as an Error.
    throw new Error(`Error occured when calling GoogleMaps API: ${e}`);
  }
};
