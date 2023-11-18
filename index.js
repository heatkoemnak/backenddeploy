const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const http = require('http');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const port = 8000;
const userRoute = require('./routes/user.route');
const messageRoute = require('./routes/message.route');
const conversationRoute = require('./routes/conversation.route');
const { Server } = require('socket.io');

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(
//   cors({
//     origin: 'https://flachat.vercel.app',
//     credentials: true,
//   })
// );
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: 'https://flachat.vercel.app',
//     methods: ['GET', 'POST'],
//   },
// });
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});
let OnlineUser = [];
const AddNewUser = (userId, socketId) => {
  !OnlineUser.some((user) => user.userId == userId) &&
    OnlineUser.push({ userId, socketId });
  return OnlineUser;
};
const getUser = (userId) => {
  return OnlineUser.find((u) => u.userId === userId);
};
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('send_user', (user) => {
    console.log(user);
    const userList = AddNewUser(user, socket.id);
    console.log(userList);
  });
  socket.on('send_message', (data) => {
    const receiver = getUser(data?.receiverId);
    console.log(receiver);
    io.to(receiver?.socketId).emit('receive_message', data);
  });
  socket.on('disconnect', () => {
    OnlineUser.find((onlineUser) => onlineUser.socketId !== socket.id);
  });
});
const MongoDB_URL = process.env.MONGO_URL;
mongoose
  .connect(MongoDB_URL)
  .then(() => {
    console.log('connected to mongodb');
  })
  .catch((err) => {
    console.log('failed to connect mongodb', err);
  });

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});

app.use('/api', userRoute);
app.use('/api', messageRoute);
app.use('/api', conversationRoute);
