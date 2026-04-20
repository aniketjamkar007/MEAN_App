const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const postRoutes = require('./routes/posts')
const userRoutes = require('./routes/user')
const mongoose = require('mongoose');

const app = express();
mongoose.connect('mongodb+srv://Aj:' + 
  process.env.MONGO_ATLAS_PW + 
  '@cluster0.4c9ks.mongodb.net/MEAN_Project ')
    .then(() => {
        console.log('Connected to database');
    })
    .catch(err => {
        console.log('Connection failed:', err);
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use('/api/posts', postRoutes);
app.use('/api/user', userRoutes);

module.exports = app;