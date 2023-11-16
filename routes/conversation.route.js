const router = require('express').Router();
const Conversations = require('../models/conversation.model');
router.post('/createCon', async (req, res) => {
  const { senderId, receiverId } = req.body;
  try {
    const conversation = await Conversations.findOne({
      members: { $all: [senderId, receiverId] },
    });
    if (conversation) {
      return res.status(200).json(conversation);
    } else {
      const newCon = new Conversations({
        members: [senderId, receiverId],
      });
      await newCon.save();
    }
    res.status(201).json(newCon);
  } catch (err) {
    res.status(400).json(err);
  }
});
router.get('/conversations', async (req, res) => {
  try {
    const conversations = await Conversations.find();
    if (!conversations) {
      return res.status(404).json('No conversations found');
    } else {
      return res.status(200).json(conversations);
    }
  } catch (error) {
    console.log(error);
  }
});
router.get('/conversations/:userId', async (req, res) => {
  try {
    const conversation = await Conversations.find({
      members: { $in: [req.params.userId] },
    });
    if (!conversation) {
      return res.status(404).json('No conversations found');
    } else {
      return res.status(200).json(conversation);
    }
  } catch (error) {
    console.log(error);
  }
});
router.delete('/conversations/:id', async (req, res) => {
  try {
    const conversation = await Conversations.findByIdAndDelete(req.params.id);
    if (!conversation) {
      return res.status(404).json('No conversation found');
    } else {
      return res.status(200).json('Conversation deleted');
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
