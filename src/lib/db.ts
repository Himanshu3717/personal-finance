import mongoose from 'mongoose';

// Define a raw connection string directly in the code for testing
const rawUri = 'mongodb://localhost:27017/personal-finance';
const MONGODB_URI = process.env.MONGODB_URI || rawUri;

console.log('Raw URI:', rawUri);
console.log('MONGODB_URI variable:', MONGODB_URI);
console.log('Type of MONGODB_URI:', typeof MONGODB_URI);
console.log('MONGODB_URI character codes:', [...MONGODB_URI].map(c => c.charCodeAt(0)));

// Ensure we're working with a string
const cleanUri = String(MONGODB_URI).trim();
console.log('Clean URI:', cleanUri);

// Make sure there are no invisible characters or encoding issues
if (!cleanUri.startsWith('mongodb://') && !cleanUri.startsWith('mongodb+srv://')) {
  console.error('Invalid MongoDB URI format after cleaning!');
  throw new Error('Invalid MongoDB URI format. Must start with mongodb:// or mongodb+srv://');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  try {
    if (cached.conn) {
      console.log('Using cached connection');
      return cached.conn;
    }

    console.log('No cached connection, creating new connection');
    
    if (!cached.promise) {
      console.log('Creating new connection promise');
      
      const opts = {
        bufferCommands: false,
      };

      cached.promise = mongoose.connect(cleanUri, opts)
        .then(mongoose => {
          console.log('Successfully connected to MongoDB');
          return mongoose;
        })
        .catch(err => {
          console.error('Error in mongoose.connect promise:', err);
          throw err;
        });
    }

    console.log('Awaiting connection promise');
    cached.conn = await cached.promise;
    console.log('Connection established');
    return cached.conn;
  } catch (error) {
    console.error('Connection error:', error);
    throw error;
  }
}

export default connectToDatabase;