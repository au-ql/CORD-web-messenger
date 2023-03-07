const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/chat.html');
});
io.on('connection', (socket) => {
  console.log(socket.id);
  socket.on('private message', (msg, recipientSocketId) => {
    socket.to(recipientSocketId).emit('private message', msg);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
http.listen(9000, () => {
  console.log('listening on *:9000');
});
const activeUsers = {};
io.on('connection', (socket) => {
  console.log('a user connected');
  // Ask user for their username
  socket.emit('request username');
  socket.on('set username', (username) => {
    // Store the username for this socket
    activeUsers[socket.id] = username;
    // Send list of active users to all clients
    io.emit('active users', Object.values(activeUsers));
    socket.on('private message', (msg, recipientUsername) => {
      // Find the recipient's socket ID by looking up their username in the dictionary
      const recipientSocketId = Object.keys(activeUsers).find(
        (socketId) => activeUsers[socketId] === recipientUsername
      );
      if (recipientSocketId) {
        socket.to(recipientSocketId).emit('private message', msg);
      } else {
        // If recipient username not found, send error message back to sender
        socket.emit('error', `User "${recipientUsername}" not found`);
      }
    });
    socket.on('disconnect', () => {
      console.log('user disconnected');
      // Remove disconnected user from activeUsers dictionary
      delete activeUsers[socket.id];
      // Send updated list of active users to all clients
      io.emit('active users', Object.values(activeUsers));
    });
  });
});
