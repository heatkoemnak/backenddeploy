const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const port = 8000;
const userRoute = require('./routes/user.route');
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const MongoDB_URL = process.env.MONGO_URL;
mongoose
  .connect(MongoDB_URL)
  .then(() => {
    console.log('connected to mongodb');
  })
  .catch((err) => {
    console.log('failed to connect mongodb', err);
  });

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});

app.use('/api', userRoute);
