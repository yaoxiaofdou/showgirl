'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const UserSchema = new Schema({
    uid: {
      type: Number,
    },
    username: {
      type: String,
    },
    createtime: {
      type: Date,
    },
    lastlogintime: { // 最后登录时间
      type: Date,
    },
    password: {
      type: String,
    },
    email: {
      type: String,
    },
    name: {
      type: String,
    },
  });
  return mongoose.model('User', UserSchema);
};
