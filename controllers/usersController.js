const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require ('../models/Post');
const {jsonAuth, auth} = require('./authController');


router.get('/', auth, (req, res) => {
    console.log(res.locals)
    const userQuery = User.find({}).select('-password').populate('savedPosts')
})