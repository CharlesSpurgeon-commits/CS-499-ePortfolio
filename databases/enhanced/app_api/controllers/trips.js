const Trip = require('../models/travlr');
const { ApiError } = require('../middleware');
const { buildTripQuery } = require('../query');

const asyncRoute = handler => (req, res, next) => Promise.resolve(handler(req, res)).catch(next);

// Read supports allow-listed filtering, sorting, and pagination. The response
// remains an array so the existing Angular client stays compatible; pagination
// metadata is exposed in headers.
const tripsList = asyncRoute(async (req, res) => {
  const { filter, page, limit, skip, sort } = buildTripQuery(req.query || {});
  const [trips, total] = await Promise.all([
    Trip.find(filter).sort(sort).skip(skip).limit(limit).lean().exec(),
    Trip.countDocuments(filter).exec()
  ]);

  res.set('X-Total-Count', String(total));
  res.set('X-Page', String(page));
  res.set('X-Page-Size', String(limit));
  res.json(trips);
});

const tripsFindByCode = asyncRoute(async (req, res) => {
  const code = req.params.tripCode.toUpperCase();
  const trip = await Trip.findOne({ code }).lean().exec();
  if (!trip) throw new ApiError(404, 'Trip not found');
  res.json([trip]); // Preserve original Angular client response shape.
});

const tripsAddTrip = asyncRoute(async (req, res) => {
  const trip = await Trip.create(req.trip);
  res.status(201).json(trip);
});

const tripsUpdateTrip = asyncRoute(async (req, res) => {
  const code = req.params.tripCode.toUpperCase();
  const trip = await Trip.findOneAndUpdate(
    { code },
    { $set: req.trip },
    { new: true, runValidators: true, context: 'query' }
  ).exec();
  if (!trip) throw new ApiError(404, 'Trip not found');
  res.json(trip);
});

const tripsDeleteTrip = asyncRoute(async (req, res) => {
  const code = req.params.tripCode.toUpperCase();
  const trip = await Trip.findOneAndDelete({ code }).exec();
  if (!trip) throw new ApiError(404, 'Trip not found');
  res.json(trip);
});

module.exports = { tripsList, tripsFindByCode, tripsAddTrip, tripsUpdateTrip, tripsDeleteTrip };
