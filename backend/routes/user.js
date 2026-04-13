const express= require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router= express.Router();

router.post('/signup', (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(result => {
                    res.status(201).json({
                        message: 'User added successfully',
                        user: result
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        message: 'An error occurred',
                        error: err
                    });
                });
        });
});

router.post('/login', (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: 'Invalid credentials'
                });
            }
            fetchedUser = user;
            return bcrypt.compare(req.body.password, user.password);
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: 'Invalid credentials'
                });
            }
            const token = jwt.sign(
                                    { email: fetchedUser.email, userId: fetchedUser._id }, 
                                    'secret_key', 
                                    { expiresIn: '1h' }
                                );
            res.status(200).json({
                message: 'Login successful',
                token: token,
                expiresIn: 3600,
                userId: fetchedUser._id
            });
        })
        .catch(err => {
            res.status(401).json({
                message: 'An error occurred',
                error: err
            });
        });
});

module.exports = router;