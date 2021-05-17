const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Post = require ('../models/Post');
const {jsonAuth, auth} = require('./authController');


router.get('/', auth, (req, res) => {
    console.log(res.locals);
    const userQuery = User.find({}).select('-password').populate('savedPosts');
    userQuery.exec((err, foundUsers) => {
        if(err){
            res.status(401).json({msg: err.message});
        }else{
            res.status(200).json(foundUsers)
        }
    })
})

router.post('/savePost/:title/:username', (req, res) =>{
    const postQuery = Post.findOne({ title: req.params.title })
    postQuery.exec(( err, post ) => {
        if(err){
            res.status(400).json({
                msg: err.message
            })
        } else {
            const addPostQuery = User.findOneAndUpdate({ username: req.params.username }, { $addToSet: { savedPosts: post._id }}, {new: true})
            addPostQuery.exec((err, updatedUser) => {
                if(err){
                    res.status(400).json({
                        msg: err.message
                    }) 
                } else {
                    console.log(updatedUser);
                    res.status(200).json({
                        msg: `Updated ${updatedUser.username} with the post ${post.title} `
                    })
                }
            })
        }
    })
})

module.exports = router;