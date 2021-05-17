const express = require('express');
const Post = require('../models/Post');
const router = express.Router()
const {hash, jsonAuth, auth} = require('./authController');
const jwt = require('jsonwebtoken');
const bcrypt = require ('bcryptjs');
const SECRET = process.env.SECRET_KEY
const User = require('../models/User');


router.get('/', async (req, res) => {
    let filters;
    if(Object.keys(req.query).length > 0){
        filters = {...req.query}
    }
    try {
        if(!filters){
            const foundPosts = await Post.find({});
            res.status(200).json(foundPosts);
        }else{
            const foundPosts = await Post.find({...filters});
            res.status(200).json(foundPosts);
        }
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
})

router.post('/addPost', (req, res) => {
    const {username, password} = req.body;
    const hashedPassword = hash(password)

    User.findOne({username}, async (err, foundUser) => {
        if(err){
            res.status(400).json({msg: err.message})
        }else{
            if(foundUser.isAuthorized){
                if(bcrypt.compareSync(hashedPassword, foundUser.password)){
                    try {
                        const createdPost = await Post.create(req.body)
                        res.status(200).json(createdPost);
                    } catch (error) {
                        res.status(400).json({
                            msg: error.message
                        })
                    }
                }else{
                    res.status(400).json({msg: "your password or username was incorrect"})
                }
            }else{
                res.status(400).json({msg: "you are not a user who is allowed to post"})
            }
        }
    })
})

router.put('/:id', (req, res) => {
    const {username, password} = req.body;
    const hashedPassword = hash(password)

    User.findOne({username}, async (err, foundUser) => {
        if(err){
            res.status(400).json({msg: err.message})
        }else{
            if(foundUser.isAuthorized){
                if(bcrypt.compareSync(hashedPassword, foundUser.password)){
                    try {
                        const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {new: true});
                        res.status(200).json(updatedPost);
                    } catch (error) {
                        res.status(400).json({
                            msg: error.message
                        })
                    }
                }else{
                    res.status(400).json({msg: "your password or username was incorrect"})
                }
            }else{
                res.status(400).json({msg: "you are not a user who is allowed to post"})
            }
        }
    })
})


router.delete('/:id', (req, res) => {
    const {username, password} = req.body;
    const hashedPassword = hash(password)

    User.findOne({username}, async (err, foundUser) => {
        if(err){
            res.status(400).json({msg: err.message})
        }else{
            if(foundUser.isAuthorized){
                if(bcrypt.compareSync(hashedPassword, foundUser.password)){
                    try {
                        const deletedPost = await Post.findByIdAndDelete(req.params.id, req.body);
                        res.status(200).json(deletedPost);
                    } catch (error) {
                        res.status(400).json({
                            msg: error.message
                        })
                    }
                }else{
                    res.status(400).json({msg: "your password or username was incorrect"})
                }
            }else{
                res.status(400).json({msg: "you are not a user who is allowed to post"})
            }
        }
    })
})

module.exports = router;