const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// this is where database connection will take place
// mongoose.connect('your-mongodb-url', { useNewUrlParser: true, useUnifiedTopology: true })
//    .then(() => console.log('Database connected!'))
//    .catch(err => console.log(err));

// Routes
const deviceRoutes = require('./routes/device');
const authRoutes = require('./routes/auth');

app.use('/device', deviceRoutes);
app.use('/auth', authRoutes);

app.listen(port, () => {
   console.log(`Server running on port ${port}`);
});
