const router = require('express').Router();
const Messages = require('../models/message.model');
router.get('/messages', async (req, res) => {
  try {
    const messages = await Messages.find({});
    if (!messages) {
      return res.status(404).json('No messages found');
    } else {
      return res.status(200).json(messages);
    }
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
