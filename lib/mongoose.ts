import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ta_db';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Étendre globalThis avec la propriété mongoose (le cache)
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

// On initialise le cache global si pas existant
const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  global.mongoose = cached;  // Mettre à jour global

  return cached.conn;
}

export default connectToDatabase;
