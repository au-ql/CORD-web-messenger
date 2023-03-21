const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");

dotenv.config();

const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const login = require("./routes/login");
const register = require("./routes/register");

app.use("/login", login);
app.use("/register", register);
app.listen(PORT, console.log(`server listening on port ${PORT}`));

app.use(express.static(path.join(__dirname, "public")));
