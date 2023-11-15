const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = require('express').Router();

const TOKEN_SECRET = 'jkmknsxanasasnklkmoasa';
router.get('/users', async (req, res) => {
  try {
    const users = await userModel.find();
    if (users) return res.status(200).json(users);
    else return res.status(400).json({ message: 'No users found' });
  } catch (error) {
    console.log(error);
  }
});

router.get('/profile', async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    jwt.verify(token, TOKEN_SECRET, (err, userData) => {
      if (err) return res.status(400).json(err);
      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
}),
  router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password)
      return res
        .status(400)
        .send({ error: 'You must provide a username and password' });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      const usernameExist = await userModel.findOne({ username });
      if (usernameExist)
        return res.status(400).send({ error: 'Username already exists' });
      const user = new userModel({
        username: username,
        password: hashedPassword,
      });
      await user.save();
      if (user) {
        jwt.sign({ userId: user._id, username }, TOKEN_SECRET, (err, token) => {
          if (err) return res.status(400).json(err);
          res
            .cookie('token', token, {
              sameSite: 'none',
              secure: true,
            })
            .status(201)
            .json({
              user: user,
            });
        });
      }
      res.status(201).json({ user: user });
    } catch (err) {
      res.status(400).json(err);
    }
  });

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ error: 'You must provide a username and password' });
  try {
    const user = await userModel.findOne({ username });
    if (!user) return res.status(400).send({ error: 'User not found' });
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).send({ error: 'Invalid password' });
    jwt.sign({ userId: user._id, username }, TOKEN_SECRET, (err, token) => {
      if (err) return res.status(400).json(err);
      res
        .cookie('token', token, {
          sameSite: 'none',
          secure: true,
        })
        .status(201)
        .json({
          user: user,
        });
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// delete user by id
router.delete('/:id', async (req, res) => {
  try {
    await userModel.findByIdAndDelete({ _id: req.params.id }, (err, result) => {
      if (err) return res.status(400).json(err);
      else return res.status(200).json(result);
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
