const mongoose = require('mongoose');

const messagesSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      required: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    messageText: {
      type: String,
      required: true,
    },
    receiverId: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: '',
    },
    time: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model('Messages', messagesSchema);
