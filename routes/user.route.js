const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = require('express').Router();
router.get('/users', async (req, res) => {
  try {
    const users = await userModel.find();
    if (users) return res.status(200).json(users);
    else return res.status(400).json({ message: 'No users found' });
  } catch (error) {
    console.log(error);
  }
});

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
    const user = new User({
      username: username,
      password: hashedPassword,
    });
    await user.save();
    if (user) {
      jwt.sign(
        { userId: user._id, username },
        process.env.TOKEN_SECRET,
        (err, token) => {
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
        }
      );
    }
    res.status(201).json({ user: user });
  } catch (err) {
    res.status(400).json(err);
  }
});




module.exports = router;
