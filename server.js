const flash = require('connect-flash');
const express = require('express');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');

const cookieParser = require('cookie-parser');
const sessions = require('express-session');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

const FiveDay = 1000 * 60 * 60 * 24 * 5;
let session;

// session middleware
app.use(
  sessions({
    secret: 'thisismysecrctekeyfhrg',
    saveUninitialized: true,
    cookie: { maxAge: FiveDay },
    resave: false,
  }),
);

app.use(cookieParser());
app.use(flash());

dotenv.config();

const login = require('./routes/login');
const register = require('./routes/register');
const logout = require('./routes/logout');

app.use('/static', express.static(path.join(__dirname, 'public')));

app.use('/login', login);
app.use('/register', register);
app.use('/logout', logout);
app.get('/', (req, res) => {
  req.flash('message', 'Welcome to Blog');
  res.redirect('/login');
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, console.log(`server listening on port ${PORT}`));

const activeUsers = {};

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.emit('request username');

  socket.on('set username', (username) => {
    activeUsers[socket.id] = username;

    io.emit('active users', Object.values(activeUsers));

    socket.on('private message', (msg, recipientUsername, senderusername) => {
      const recipientSocketId = Object.keys(activeUsers).find(
        (socketId) => activeUsers[socketId] === recipientUsername,
      );

      if (recipientSocketId) {
        socket.to(recipientSocketId).emit('private message', msg, senderusername);
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
