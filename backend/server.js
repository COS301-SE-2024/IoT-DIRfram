const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const crypto = require('crypto');
const dotenv = require('dotenv');
const cors = require('cors');


dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());
// app.use(cors({ origin: process.env.FRONTEND_URL }));

let client;
let mongoServer;

async function connectToDatabase() {
  const useMockDB = process.env.NODE_ENV === 'test' || process.env.USE_MOCK_DB === 'true';
  if (useMockDB) {
    // Use mock database
    mongoServer = await MongoMemoryServer.create();
    const mockUri = mongoServer.getUri();
    console.log("Connecting to mock MongoDB with URI:", mockUri);
    client = new MongoClient(mockUri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });

  } else {
    // Use real MongoDB database
    const uri = process.env.MONGO_URI;
    console.log("Connecting to real MongoDB with URI:", uri); // Debug
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
  }

  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
}

async function startServer() {
  await connectToDatabase();

  // Now pass the connected `client` to your routes
  const deviceRoutes = require('./routes/device')(client); 
  const authRoutes = require('./routes/auth')(client); 
  const postRoutes = require('./routes/posts')(client);

  app.use('/device', deviceRoutes);
  app.use('/auth', authRoutes);
  app.use('/posts', postRoutes);

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  if (process.env.NODE_ENV === 'test' || process.env.USE_MOCK_DB === 'true') {
    // add some base data
    const db = client.db('Auth');
    const usersCollection = db.collection('Users');
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = crypto.createHash('sha256').update("Password@123" + salt).digest('hex');
    await usersCollection.insertOne({
      username: "DaganTheKing",
      email: "dagantheking@gmail.com",
      password: hashedPassword,
      salt: salt,
      age: "21",
      name: "Monica",
      surname: "King"
    });
  }
}

startServer();
