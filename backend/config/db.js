const mongoose = require('mongoose');

let isInMemory = false;

const connectDB = async () => {
  const connString = process.env.MONGODB_URI;
  if (connString) {
    try {
      const conn = await mongoose.connect(connString);
      console.log(`[MongoDB] Connected: ${conn.connection.host}`);
      isInMemory = false;
      return true;
    } catch (err) {
      console.error(`[MongoDB] Connection Error: ${err.message}. Falling back to in-memory store.`);
      isInMemory = true;
      return false;
    }
  } else {
    console.log('[MongoDB] MONGODB_URI not found in env. Running with in-memory data store for seamless local execution.');
    isInMemory = true;
    return false;
  }
};

const getIsInMemory = () => isInMemory;

module.exports = { connectDB, getIsInMemory };
