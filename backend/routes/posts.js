const express= require('express');
const postController = require('../controllers/posts');
const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');
const router= express.Router();



router.post('', checkAuth, extractFile, postController.addNewPost);

router.put('/:id', checkAuth, extractFile, postController.updatePost);

router.get('/:id', postController.getPost);

router.get('', postController.getPosts);

router.delete('/:id', checkAuth, postController.deletePost);

module.exports = router;