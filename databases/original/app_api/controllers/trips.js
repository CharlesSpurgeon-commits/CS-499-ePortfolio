const Trip = require('../models/travlr');
const { ApiError } = require('../middleware');
const asyncRoute = handler => (req, res, next) => Promise.resolve(handler(req, res)).catch(next);
const tripsList = asyncRoute(async (req, res) => res.json(await Trip.find({}).exec()));
const tripsFindByCode = asyncRoute(async (req, res) => {
  const trip = await Trip.findOne({ code: req.params.tripCode }).exec();
  if (!trip) throw new ApiError(404, 'Trip not found');
  res.json([trip]); // Preserve original Angular client response shape.
});
const tripsAddTrip = asyncRoute(async (req, res) => res.status(201).json(await Trip.create(req.trip)));
const tripsUpdateTrip = asyncRoute(async (req, res) => {
  const trip = await Trip.findOneAndUpdate({ code: req.params.tripCode }, req.trip, { new: true, runValidators: true }).exec();
  if (!trip) throw new ApiError(404, 'Trip not found');
  res.json(trip);
});
const tripsDeleteTrip = asyncRoute(async (req, res) => {
  const trip = await Trip.findOneAndDelete({ code: req.params.tripCode }).exec();
  if (!trip) throw new ApiError(404, 'Trip not found');
  res.json(trip);
});
module.exports = { tripsList, tripsFindByCode, tripsAddTrip, tripsUpdateTrip, tripsDeleteTrip };
