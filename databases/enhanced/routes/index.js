var express = require('express');
var router = express.Router();

const ctrlMain = require('../controllers/main');

// Home
router.get('/', ctrlMain.index);

// Other pages
router.get('/travel', ctrlMain.travel);
router.get('/rooms', ctrlMain.rooms);
router.get('/meals', ctrlMain.meals);
router.get('/news', ctrlMain.news);
router.get('/about', ctrlMain.about);
router.get('/contact', ctrlMain.contact);

module.exports = router;