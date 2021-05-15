const mongoose = require('mongoose');

const db = {};

db.mongoose = mongoose;

db.post = require("./post.model");
db.count = require("./count.model");

module.exports = db;