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
router.get('/messages/:conversationId', async (req, res) => {
  try {
    const messages = await Messages.find({
      conversationId: req.params.conversationId,
    });
    if (!messages) {
      return res.status(404).json('No messages found');
    } else {
      return res.status(200).json(messages);
    }
  } catch (error) {
    console.log(error);
  }
});

router.post('/send_message', async (req, res) => {
  const {
    conversationId,
    senderId,
    senderName,
    messageText,
    receiverId,
    profilePicture,
    time,
  } = req.body;
  try {
    const message = new Messages({
      conversationId: conversationId,
      senderId: senderId,
      senderName: senderName,
      messageText: messageText,
      receiverId: receiverId,
      profilePicture: profilePicture,
      time: time,
    });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(400).json(err);
  }
});
module.exports = router;
