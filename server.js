require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { hash } = require('./controllers/authController');
const SECRET = process.env.SECRET_KEY;
const User = require('./models/User');


const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    connectTimeoutMS: 3000
},(err, res)=>{
    try{
        console.log("Mongo is Connected")
    } catch(err) {
        console.log(err)
    }
})

app.use('/posts', require('./controllers/postsController'));
app.use('/users', require("./controllers/usersController"));

app.post('/login', (req, res) => {
    const {username, password} = req.body;
    const hashedPassword = hash(password);

    User.findOne({username}, (err, foundUser) => {
        if(err){
            res.status(400).json({
                msg: err.message
            })
        }else{
            if(bcrypt.compareSync(hashedPassword, foundUser.password)){
                const token = jwt.sign({
                    id: foundUser._id,
                    username: foundUser.username
                }, SECRET)
                res.status(200).json({token, username: foundUser.username, isAuthorized: foundUser.isAuthorized})
            }else{
                res.status(500).json({
                    problem: 'the hash comparison did not work'
                })
            }
        }
    })
})

app.post('/register', (req, res) => {
    const passwordHash = hash(req.body.password);
    req.body.password = bcrypt.hashSync(passwordHash, bcrypt.genSaltSync(10))

    User.create(req.body, (err, createdUser) => {
        if(err){
            res.status(400).json({
                msg: err.message
            })
        }else{
            const token = jwt.sign({
                id: createdUser._id,
                username: createdUser.username
            }, SECRET)
            res.status(200).json({token, isAuthorized: createdUser.isAuthorized})
        }
    })
})





app.listen(PORT, () => console.log('App listening on port ' + PORT));