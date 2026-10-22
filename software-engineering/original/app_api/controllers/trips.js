const mongoose = require('mongoose');
const Model = mongoose.model('trips');

// GET: /trips
const tripsList = async (req, res) => {
  try {
    const trips = await Model.find({}).exec();

    if (!trips) {
      return res
        .status(404)
        .json({ message: 'No trips found' });
    }

    return res
      .status(200)
      .json(trips);
  } catch (error) {
    return res
      .status(400)
      .json(error);
  }
};

// GET: /trips/:tripCode
const tripsFindByCode = async (req, res) => {
  try {
    const trip = await Model.find({
      code: req.params.tripCode
    }).exec();

    if (!trip || trip.length === 0) {
      return res
        .status(404)
        .json({ message: 'Trip not found' });
    }

    return res
      .status(200)
      .json(trip);
  } catch (error) {
    return res
      .status(400)
      .json(error);
  }
};

// POST: /trips
const tripsAddTrip = async (req, res) => {
  try {
    const newTrip = await Model.create({
      code: req.body.code,
      name: req.body.name,
      length: req.body.length,
      start: req.body.start,
      resort: req.body.resort,
      perPerson: req.body.perPerson,
      image: req.body.image,
      description: req.body.description
    });

    return res
      .status(201)
      .json(newTrip);
  } catch (error) {
    return res
      .status(400)
      .json(error);
  }
};

const tripsUpdateTrip = async (req, res) => {
  try {
    const updatedTrip = await Model.findOneAndUpdate(
      { code: req.params.tripCode },
      {
        code: req.body.code,
        name: req.body.name,
        length: req.body.length,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description
      },
      {
        new: true,
        runValidators: true
      }
    ).exec();

    if (!updatedTrip) {
      return res
        .status(404)
        .json({ message: 'Trip not found' });
    }

    return res
      .status(201)
      .json(updatedTrip);
  } catch (error) {
    return res
      .status(400)
      .json(error);
  }
};

const tripsDeleteTrip = async (req, res) => {
  try {
    const deletedTrip = await Model.findOneAndDelete({
      code: req.params.tripCode
    }).exec();

    if (!deletedTrip) {
      return res
        .status(404)
        .json({ message: 'Trip not found' });
    }

    return res
      .status(200)
      .json(deletedTrip);
  } catch (error) {
    return res
      .status(400)
      .json(error);
  }
};

module.exports = {
  tripsList,
  tripsFindByCode,
  tripsAddTrip,
  tripsUpdateTrip,
  tripsDeleteTrip
};