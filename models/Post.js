const {Schema, model} = require('mongoose');

const postSchema = new Schema({
    title: { type: String, required: true, unique: true },
    body: String,
    dish: { type: String, required: true },
    cuisine: { type: String, required: true },
    summary: String,
    rating: Number
})

module.exports = model('Post', postSchema);