const fs = require('fs');

const trips = JSON.parse(
  fs.readFileSync('./data/trips.json', 'utf8')
);

const index = (req, res) => {
  res.render('index', { title: 'Enjoy the Summer with Us!' });
};

const travel = (req, res) => {
  console.log('Trips loaded:', trips);
  console.log('Number of trips:', trips.length);

  res.render('travel', {
    title: 'Travel',
    trips: trips
  });
};

const rooms = (req, res) => {
  res.render('rooms', { title: 'Rooms' });
};

const meals = (req, res) => {
  res.render('meals', { title: 'Meals' });
};

const news = (req, res) => {
  res.render('news', { title: 'News' });
};

const about = (req, res) => {
  res.render('about', { title: 'About' });
};

const contact = (req, res) => {
  res.render('contact', { title: 'Contact' });
};

module.exports = {
  index,
  travel,
  rooms,
  meals,
  news,
  about,
  contact
};