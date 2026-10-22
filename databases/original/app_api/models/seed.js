const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Trip = require('./travlr');

const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/travlr';

const seedDatabase = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log(`Connected to ${dbURI}`);

    const dataPath = path.join(
  __dirname,
  '..',
  '..',
  'data',
  'trips.json'
);
    const trips = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    await Trip.deleteMany({});
    console.log('Existing trips removed');

    const insertedTrips = await Trip.insertMany(trips);
    console.log(`${insertedTrips.length} trips inserted successfully`);
  } catch (error) {
    console.error('Database seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

seedDatabase();