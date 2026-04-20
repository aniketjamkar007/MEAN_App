const PostModel = require('../models/post');

exports.addNewPost = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const post = new PostModel({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + '/images/' + req.file.filename,
        creator: req.userData.userId
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
        })
        .catch(error => {
            res.status(500).json({
                message: 'Creating a post failed!'
            });
        });
}

exports.updatePost = (req, res, next) => {
    let imagePath = req.body.image;
    if (req.file) {
        const url = req.protocol + '://' + req.get('host');
        imagePath = url + '/images/' + req.file.filename
    }
    const updatedPost = new PostModel ({
        _id: req.params.id,
        title: req.body.title,
        content: req.body.content,
        imagePath: imagePath,
        creator: req.userData.userId
    });
    PostModel.updateOne({_id: req.params.id, creator: req.userData.userId}, updatedPost)
        .then(result => {
            if(result.modifiedCount > 0) {
                res.status(200).json({
                    message: 'Update successful!'
                });
            } else {
                res.status(401).json({
                    message: 'Not authorized!'
                });
            }
        })
        .catch(error => {
            res.status(500).json({
                message: 'Couldn\'t update post!'
            });
        });
}

exports.getPost = (req,res,next) =>{
    PostModel.findById(req.params.id).then(post => {
        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({message: 'Post not found'});
        }
    })
}

exports.getPosts = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = PostModel.find();
    if (pageSize && currentPage) {
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }
    let fetchedPosts;
    postQuery
        .then(documents => {
            fetchedPosts = documents;
            return PostModel.countDocuments();
        })
        .then((count) => {
            res.status(200).json({
                message: 'posts fetched successfully',
                posts: fetchedPosts,
                maxPosts: count
            });
        })
        .catch(error => {
            res.status(500).json({
                message: 'Fetching posts failed!'
            });
        });
}

exports.deletePost = (req, res, next) => {
    PostModel.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
        if(result.deletedCount > 0) {
            res.status(200).json({message: 'Post deleted'});
        } else {
            res.status(401).json({message: 'Not authorized!'});
        }
    })
    .catch(error => {
        res.status(500).json({
            message: 'Deleting posts failed!'
        });
    });
}