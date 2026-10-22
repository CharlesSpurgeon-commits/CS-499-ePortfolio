const { ApiError } = require('./middleware');
const fields = ['code', 'name', 'length', 'start', 'resort', 'perPerson', 'image', 'description'];
const validateCode = (req, res, next) => {
  if (!/^[A-Za-z0-9_-]{1,30}$/.test(req.params.tripCode)) return next(new ApiError(400, 'Invalid trip code'));
  next();
};
const validateTrip = (req, res, next) => {
  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body) || Object.keys(body).some(key => !fields.includes(key)))
    return next(new ApiError(400, 'Unexpected trip fields'));
  const trip = {};
  for (const field of fields) {
    if (typeof body[field] !== 'string' || !body[field].trim() || body[field].length > (field === 'description' ? 2000 : 200))
      return next(new ApiError(400, `Invalid ${field}`));
    trip[field] = body[field].trim();
  }
  if (!/^[A-Za-z0-9_-]{1,30}$/.test(trip.code)) return next(new ApiError(400, 'Invalid code'));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trip.start) || Number.isNaN(Date.parse(trip.start)) || new Date(trip.start).toISOString().slice(0,10) !== trip.start)
    return next(new ApiError(400, 'Invalid start date'));
  if (req.params.tripCode && req.params.tripCode !== trip.code) return next(new ApiError(400, 'Trip code cannot be changed'));
  req.trip = trip;
  next();
};
module.exports = { validateCode, validateTrip };
