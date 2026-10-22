const mongoose = require('mongoose');

const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/travlr';

mongoose.connect(dbURI);

console.log('mongoose.js loaded');

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected');
});

mongoose.connection.on('error', err => {
  console.error('Mongoose connection error');
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Load the Trip model
require('./travlr');