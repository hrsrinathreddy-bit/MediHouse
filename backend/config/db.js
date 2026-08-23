const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // Sanitize URI to eliminate accidental double slashes before the database name
    let uri = (process.env.MONGODB_URI || '').trim();
    uri = uri.replace('.mongodb.net//', '.mongodb.net/');

    const opts = {
      bufferCommands: false,
      dbName: 'medicare_db' // Explicitly sets the clean database namespace
    };

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      console.log('[MongoDB] Connected successfully to database namespace');
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('[MongoDB] Connection error:', e);
    throw e;
  }

  return cached.conn;
};

module.exports = { connectDB };