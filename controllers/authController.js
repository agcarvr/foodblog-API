require('dotenv').config();
const SECRET = process.env.SECRET_KEY;
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

module.exports.hash = (password) => {
    return(crypto
            .createHmac('sha256', SECRET)
            .update(password)
            .digest("hex")
            .split('')
            .reverse()
            .join()    
        )
}


module.exports.jsonAuth = (req, res, next) => {
    const token = req.body.token;
    jwt.verify(token, SECRET, (err, user) => {
        if(err){
            res.sendStatus(403)
        }else{
            if(user.usename === req.body.username){
                res.locals.user = user.username;
                next();
            }else{
                res.sendStatus(401)
            }
        }
    })
}


module.exports.auth = (req, res, next) => {
    const authHeader = req.headers.authorization
}