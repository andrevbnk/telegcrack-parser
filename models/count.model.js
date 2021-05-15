const mongoose = require("mongoose");

const Count = mongoose.model(
  "Count",
  new mongoose.Schema({
    dateCount:{type:Date,default:Date.now},
    count:{type:Number},
    isCounter:{type:Boolean},
  })
);

module.exports = Count;