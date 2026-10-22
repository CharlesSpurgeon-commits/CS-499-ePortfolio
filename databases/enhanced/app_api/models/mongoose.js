const mongoose = require('mongoose');

const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/travlr';

// Explicit connection options make database failures fail fast and bound the
// application's connection pool instead of relying entirely on defaults.
mongoose.connect(dbURI, {
  serverSelectionTimeoutMS: 5000,
  maxPoolSize: 10
}).catch(err => {
  console.error('Initial MongoDB connection failed:', err.message);
});

mongoose.connection.on('connected', () => console.log('Mongoose connected'));
mongoose.connection.on('error', err => console.error('Mongoose connection error:', err.message));
mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));

// Close the database connection cleanly when the application is stopped.
const gracefulShutdown = async signal => {
  try {
    await mongoose.connection.close();
    console.log(`Mongoose disconnected through ${signal}`);
    process.exit(0);
  } catch (err) {
    console.error('Error during MongoDB shutdown:', err.message);
    process.exit(1);
  }
};

process.once('SIGINT', () => gracefulShutdown('SIGINT'));
process.once('SIGTERM', () => gracefulShutdown('SIGTERM'));

require('./travlr');
