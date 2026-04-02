const express = require('express');
const bodyParser = require('body-parser');
const postRoutes = require('./routes/posts')
const mongoose = require('mongoose');

const app = express();
mongoose.connect('mongodb+srv://Aj:<email me>@cluster0.4c9ks.mongodb.net/MEAN_Project ')
    .then(() => {
        console.log('Connected to database');
    })
    .catch(() => {
        console.log('Connection failed');
    })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

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

app.use(postRoutes);

module.exports = app;