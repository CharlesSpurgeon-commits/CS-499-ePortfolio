const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Trip = require('./travlr');

const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/travlr';

const seedDatabase = async () => {
  try {
    await mongoose.connect(dbURI, { serverSelectionTimeoutMS: 5000, maxPoolSize: 5 });
    console.log(`Connected to ${dbURI}`);

    const dataPath = path.join(__dirname, '..', '..', 'data', 'trips.json');
    const trips = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    // Validate each source record before writing and upsert by unique trip code.
    // This avoids deleting the collection and makes repeated seeding idempotent.
    const operations = trips.map(rawTrip => {
      const trip = new Trip(rawTrip);
      const error = trip.validateSync();
      if (error) throw error;
      const data = trip.toObject();
      delete data._id;
      delete data.createdAt;
      delete data.updatedAt;
      return {
        updateOne: {
          filter: { code: data.code },
          update: { $set: data },
          upsert: true
        }
      };
    });

    await Trip.syncIndexes();
    const result = await Trip.bulkWrite(operations, { ordered: true });
    console.log(`Seed complete: ${result.upsertedCount} inserted, ${result.modifiedCount} updated`);
  } catch (error) {
    console.error('Database seeding failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

seedDatabase();
