const express = require('express');
const bodyParser = require('body-parser');
const PostModel = require('./models/post');
const mongoose = require('mongoose');

const app = express();
mongoose.connect('mongodb+srv://Aj:aqpSrzI4IV08h3kD@cluster0.4c9ks.mongodb.net/MEAN_Project ')
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

app.post('/api/post', (req,res,next) => {
    const post = new PostModel({
        title: req.body.title,
        content: req.body.content
    });
    post.save()
        .then(createdPost => {
            res.status(201).json({
                message: 'posts added successfully',
                postId: createdPost._id
            });
        });
})

app.get('/api/posts', (req, res, next) => {
    PostModel.find()
        .then((documents) => {
            res.status(200).json({
                message: 'posts fetched successfully',
                posts: documents
            });
        });
});

app.delete('/api/post/:id', (req, res, next) => {
    PostModel.deleteOne({_id: req.params.id}).then(result => {
        console.log(result);
        res.status(200).json({message: 'Post deleted'});
    });
})

module.exports = app;