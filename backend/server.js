const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const crypto = require('crypto');
const dotenv = require('dotenv');
const cors = require('cors');
const { ObjectId } = require('mongodb');


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
    const authDB = client.db('Auth');
    const usersCollection = authDB.collection('Users');
    const uartDB = client.db('uart_data');
    const postsCollection = uartDB.collection('Posts');
    const responsesCollection = uartDB.collection('Responses');
    const file_dataCollection = uartDB.collection('file_data');
    const pi_devicesCollection = uartDB.collection('pi_devices');
    const users_devicesCollection = uartDB.collection('users_devices');

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

    await usersCollection.insertOne({
      username: "BoeJiden",
      email: "email@email.com",
      password: hashedPassword,
      salt: salt,
      age: "21",
      name: "Boe",
      surname: "Jiden"
    });

    await pi_devicesCollection.insertOne({
      _id: "1000000013dcc3ed",
      device_name: "raspberrypi",
    });

    await pi_devicesCollection.insertOne({
      _id: "1000000013dcc3ee",
      device_name: "raspberrypi1",
    });

    await users_devicesCollection.insertOne({
      username: "DaganTheKing",
      device_id: "1000000013dcc3ed",
      device_name: "Pi1",
    });

    await file_dataCollection.insertOne({
      type: "text",
      content: "ContentHere",
      filename: "file.txt",
      device_name: "raspberrypi",
      device_serial_number: "1000000013dcc3ed",
      //array of 40 floats
      voltage: [
        3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 4.0, 4.1, 4.2,
        4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 5.0, 5.1, 5.2,
        5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 6.0, 6.1, 6.2,
        6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 7.0, 7.1, 7.2
      ],

    });
    // create objectId 66c7a5b4ce7e80fd2206ba97
    
    await postsCollection.insertOne({
      _id: new ObjectId("66c7a5b4ce7e80fd2206ba97"),
      title:"How to Turn on Device",
      content: "I'm having trouble turning it on, any help would be appreciated",
      authorId: "DaganTheKing",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await responsesCollection.insertOne({
      postId: "66c7a5b4ce7e80fd2206ba97",
      content:"Well Boe, as I've said, Just don't lol",
      authorId: "DaganTheKing",
      createdAt: new Date(),
      likes: [],
      dislikes: ["BoeJiden"]
    });

  }
}

startServer();
