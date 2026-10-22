const express = require('express');
const router = express.Router();

const tripsController = require('../controllers/trips');

router.get('/trips', tripsController.tripsList);
router.post('/trips', tripsController.tripsAddTrip);
router.get('/trips/:tripCode', tripsController.tripsFindByCode);
router.put('/trips/:tripCode', tripsController.tripsUpdateTrip);
router.delete(
  '/trips/:tripCode',
  tripsController.tripsDeleteTrip
);

module.exports = router;