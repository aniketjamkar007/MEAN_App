const express= require('express');
const PostModel = require('../models/post');

const router= express.Router();

router.post('/api/post', (req,res,next) => {
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
});

router.put('/api/post/:id', (req, res, next) => {
    const updatedPost = new PostModel ({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content
    });
    PostModel.updateOne({_id: req.params.id}, updatedPost)
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Update successul!'
            })
        });
});

router.get('/api/posts/:id', (req,res,next) =>{
    PostModel.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({message: 'Post not found'});
        }
    })
})

router.get('/api/posts', (req, res, next) => {
    PostModel.find()
        .then((documents) => {
            res.status(200).json({
                message: 'posts fetched successfully',
                posts: documents
            });
        });
});

router.delete('/api/post/:id', (req, res, next) => {
    PostModel.deleteOne({_id: req.params.id}).then(result => {
        console.log(result);
        res.status(200).json({message: 'Post deleted'});
    });
});

module.exports = router;