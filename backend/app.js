const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const constants = require('./constants');

const restaurantsRouter = require('./routes/restaurants');
const photosRouter = require('./routes/photos');

const credentials = `${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}`;
const url = `${constants.MONGODB_PROTOCOL}${credentials}@${constants.MONGODB_HOSTNAME}/db?authSource=admin`;
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('open', () => console.log('> successfully connected to mongo'));
db.on('error', (error) => {
  console.error('couldn\'t connect to mongo database @', url);
  console.error('connection error:', error);
});

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use('/restaurants', restaurantsRouter);
app.use('/photos', photosRouter);

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({ error: err });
});

module.exports = app;
