const express= require('express');
const multer = require('multer');
const PostModel = require('../models/post');
const router= express.Router();

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type');
        if (isValid) {
            error = null;
        }
        cb(error, 'backend/images');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext);
    }
});

router.post('/api/post', multer({ storage: storage }).single('image'), (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new PostModel({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename
    });
    post.save()
        .then(createdPost => {
            res.status(201).json({
                message: 'posts added successfully',
                post : {
                    ...createdPost,
                    id: createdPost._id
                }
            });
        });
});

router.put('/api/post/:id', multer({ storage: storage }).single('image'), (req, res, next) => {
    let imagePath = req.body.image;
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename
    }
    const updatedPost = new PostModel ({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath
    });
    console.log(updatedPost);
    PostModel.updateOne({_id: req.params.id}, updatedPost)
        .then(result => {
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