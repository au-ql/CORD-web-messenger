const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();

app.use(bodyParser);

const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');

app.use('/user', userRoutes);
app.use('/chat', chatRoutes);
app.use('/message', messageRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`server listening on port ${PORT}`));
