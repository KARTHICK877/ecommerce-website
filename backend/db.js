// db.js

const { MongoClient } = require("mongodb");

// Connection URL
const mongoURI = process.env.MONGO_URI;

// Create a new MongoClient without useNewUrlParser and useUnifiedTopology
const mongoClient = new MongoClient(mongoURI);

// Function to connect to MongoDB
const connectToMongo = async () => {
  try {
    await mongoClient.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

// Export the MongoClient and the connectToMongo function
module.exports = { mongoClient, connectToMongo };
