const RADIUS_BUMI_METER = 6_371_000;

const keRadian = (derajat) => (derajat * Math.PI) / 180;

// Jarak dua koordinat dengan rumus haversine, dibulatkan ke meter (BR-01)
function hitungJarakMeter(lat1, lng1, lat2, lng2) {
  const dLat = keRadian(lat2 - lat1);
  const dLng = keRadian(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(keRadian(lat1)) * Math.cos(keRadian(lat2)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * RADIUS_BUMI_METER * Math.asin(Math.sqrt(a)));
}

module.exports = { hitungJarakMeter };
