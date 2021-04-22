const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

// setup express
const app = express();

// setup body parser middleware to conver to JSON and handle URL encoded forms
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

// connect to the mongodb database
mongoose.connect('mongodb://localhost:27017/repairTickets', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: [
    'secretValue'
  ],
  cookie: {
    maxAge: 24/*hours*/ * 60/*min*/ * 60/*sec*/ * 1000/*ms*/ // 24 hours 
  }
}));

const users = require("./user.js");
app.use("/api/users/", users.routes);

const requests = require("./requests.js");
app.use("/api/requests", requests.routes);

app.listen(3003, () => console.log('Server listening on port 3003!'));