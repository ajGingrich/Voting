'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Polls = new Schema({
    name: String,
    author: String,
    votes: Number,
    options: [{
        name: String,
        count: Number
    }]
}, { strict: false });

module.exports = mongoose.model('Polls', Polls);
