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
module.exports = router;
