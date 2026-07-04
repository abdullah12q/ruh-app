import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10,
};

if (!uri) {
  throw new Error("Please add your MongoDB URI to .env as MONGODB_URI");
}

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // In dev, reuse the global MongoClient to survive hot reloads
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, fresh client per module load (lambda)
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
