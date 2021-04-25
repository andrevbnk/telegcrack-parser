const mongoose = require('mongoose');

const db = {};

db.mongoose = mongoose;

db.post = require("./post.model");

module.exports = db;