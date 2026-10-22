const mongoose = require('mongoose');

// Database-level validation keeps trip data consistent even when records are
// created outside of the normal API route.
const tripSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
    maxlength: 30,
    match: /^[A-Z0-9_-]+$/
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
    index: true
  },
  length: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  start: {
    type: Date,
    required: true,
    index: true
  },
  resort: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
    index: true
  },
  perPerson: {
    type: String,
    required: true,
    trim: true,
    match: /^\d+(\.\d{1,2})?$/
  },
  image: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
  }
}, {
  timestamps: true,
  versionKey: false
});

// Supports common date/resort searches without scanning the entire collection.
tripSchema.index({ resort: 1, start: 1 });

const Trip = mongoose.model('trips', tripSchema);

module.exports = Trip;
