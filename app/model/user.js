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
    // 以下是微信登录用户才有的信息
    openid: {
      type: String,
    },
    language: {
      type: String,
    },
    country: {
      type: String,
    },
    city: {
      type: String,
    },
    province: {
      type: String,
    },
    avatarUrl: {
      type: String,
    },
  });
  return mongoose.model('User', UserSchema);
};
