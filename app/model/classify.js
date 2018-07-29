'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const ClassifySchema = new Schema({
    cid: {
      type: Number,
    },
    name: {
      type: String,
    },
    createtime: {
      type: Date,
    },
    sum: {
      type: Number,
    },
    size: {
      type: Number,
    },
  });
  return mongoose.model('Classify', ClassifySchema);
};
