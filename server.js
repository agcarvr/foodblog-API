require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true
});

mongoose.connection.once('connected', () => console.log('Connected to mongodb'));






app.listen(PORT, () => console.log('App listening on port ' + PORT));