const express = require('express');

const app = express();

app.use('/api/posts', (req, res, next) => {
    const posts = [
        {
            id: 'post-1',
            title: 'First server side post',
            content: 'This is coming from the server'
        },
        {
            id: 'post-2',
            title: 'second server side post',
            content: 'This is coming from the server'
        },
        {
            id: 'post-3',
            title: 'third server side post',
            content: 'This is coming from the server'
        },
    ]
    res.status(200).json({
        message: 'posts fetched successfully',
        posts: posts
    })
});

module.exports = app;