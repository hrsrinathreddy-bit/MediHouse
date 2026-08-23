const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    let rawUri = (process.env.MONGODB_URI || '').trim();

    // Clean up any extra quotes or accidental double slashes in the path
    rawUri = rawUri.replace(/^["']|["']$/g, ''); // Remove surrounding quotes if any

    // Split URL and parameters to cleanly enforce the database name
    const [baseUrl, queryParams] = rawUri.split('?');
    const cleanBase = baseUrl.replace(/\/+$/, ''); // Remove trailing slashes
    const lastSlashIndex = cleanBase.lastIndexOf('/');
    const hostPart = cleanBase.substring(0, lastSlashIndex);

    // Standardize to a pristine URI format
    const finalUri = `${hostPart}/medicare_db${queryParams ? '?' + queryParams : '?retryWrites=true&w=majority'}`;

    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(finalUri, opts).then((mongooseInstance) => {
      console.log('[MongoDB] Connected successfully');
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