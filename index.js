const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/users', (req, res) => {
  res.send('Hello users');
});
// MONGO_URL = 'mongodb+srv://heatkimnak:EnITmN2hkFbRiTzy@cluster0.ffsxyzk.mongodb.net/mernchat?retryWrites=true&w=majority';
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
