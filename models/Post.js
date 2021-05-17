const {Schema, model} = require('mongoose');

const postSchema = new Schema({
    title: { type: String, required: true, unique: true },
    body: String,
    dish: { type: String, required: true },
    quisine: { type: String, required: true }
})

module.exports = model('Post', postSchema);