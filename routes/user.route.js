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
    const user = new userModel({
      username: username,
      password: hashedPassword,
    });
    await user.save();
    // if (user) {
    //   jwt.sign(
    //     { userId: user._id, username },
    //     process.env.TOKEN_SECRET,
    //     (err, token) => {
    //       if (err) return res.status(400).json(err);
    //       res
    //         .cookie('token', token, {
    //           sameSite: 'none',
    //           secure: true,
    //         })
    //         .status(201)
    //         .json({
    //           user: user,
    //         });
    //     }
    //   );
    // }
    res.status(201).json({ user: user });
  } catch (err) {
    res.status(400).json(err);
  }
});

// delete user by id
router.delete('/', async (req, res) => {
  const { userId } = req.body;
  try {
    await userModel.findByIdAndDelete({ _id: userId }, (err, result) => {
      if (err) return res.status(400).json(err);
      else return res.status(200).json(result);
    });
  } catch (error) {
    console.log(error);
  }
  // try {
  //   const user = await userModel.findByIdAndDelete(req.params.id);
  //   if (user) return res.status(200).json({ message: 'User deleted' });
  //   else return res.status(400).json({ message: 'User not found' });
  // } catch (error) {
  //   console.log(error);
  // }
});

module.exports = router;
