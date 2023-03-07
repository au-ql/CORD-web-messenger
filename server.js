const express = require('express');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

dotenv.config();

// const userRoutes = require('./routes/userRoutes');
// const chatRoutes = require('./routes/chatRoutes');
// const messageRoutes = require('./routes/messageRoutes');
const login = require('./routes/login');
const register = require('./routes/register');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/login', login);
app.use('/register', register);

const PORT = process.env.PORT || 3000;
http.listen(PORT, console.log(`server listening on port ${PORT}`));
// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });

const activeUsers = {};

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.emit('request username');

  socket.on('set username', (username) => {
    activeUsers[socket.id] = username;

    io.emit('active users', Object.values(activeUsers));

    socket.on('private message', (msg, recipientUsername) => {
      const recipientSocketId = Object.keys(activeUsers).find(
        (socketId) => activeUsers[socketId] === recipientUsername,
      );

      if (recipientSocketId) {
        socket.to(recipientSocketId).emit('private message', msg);
      } else {
        socket.emit('error', `User "${recipientUsername}" not found`);
      }
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');

      delete activeUsers[socket.id];

      io.emit('active users', Object.values(activeUsers));
    });
  });
});
