const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

//mongoDB Atlas connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected!'))
    .catch(err => console.log(err));

//routes
const deviceRoutes = require('./routes/device');
const authRoutes = require('./routes/auth');

app.use('/device', deviceRoutes);
app.use('/auth', authRoutes);

app.listen(port, () => {
   console.log(`Server running on port ${port}`);
});
