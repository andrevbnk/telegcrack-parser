const mongoose = require("mongoose");

const Post = mongoose.model(
  "Post",
  new mongoose.Schema({
    dateFind:{type:Date,default:Date.now},
    link:{type:String,required:'Link require'},
    author:{type:String,default:'None'},
    pageTelecrack:{type:String},
  })
);

module.exports = Post;