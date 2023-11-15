const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get('/users', (req, res) => {
  res.send('Hello users');
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
