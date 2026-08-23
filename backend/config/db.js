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

    // Remove enclosing quotes if present
    rawUri = rawUri.replace(/^["']|["']$/g, '');

    // Sanitize accidental multiple slashes before the database name
    let cleanUri = rawUri.replace(/mongodb\.net\/+(\w+)/i, 'mongodb.net/$1');
    cleanUri = cleanUri.replace(/mongodb\.net\/+\?/i, 'mongodb.net/medicare_db?');
    if (!cleanUri.includes('.mongodb.net/') || cleanUri.endsWith('.mongodb.net/')) {
      cleanUri = cleanUri.replace(/\/?$/, '/medicare_db?retryWrites=true&w=majority');
    }

    const opts = {
      bufferCommands: false,
      dbName: 'medicare_db'
    };

    cached.promise = mongoose.connect(cleanUri, opts).then((mongooseInstance) => {
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

const getIsInMemory = () => false;
const getDemoStore = () => ({ users: [], appointments: [], vitals: [] });

module.exports = {
  connectDB,
  getIsInMemory,
  getDemoStore
};