const router = require('express').Router();
const Conversations = require('../models/conversation.model');
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