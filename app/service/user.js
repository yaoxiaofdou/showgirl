'use strict';
// app/service/user.js
const Service = require('egg').Service;

class UserService extends Service {

  async login(userInfo) {
    const { ctx } = this;
    return new Promise(resolve => {
      if (userInfo.username && userInfo.password) {
        ctx.model.User.findOne({ username: userInfo.username, password: userInfo.password }, (err, response) => {
          if (err) resolve({ msg: '登录接口报错，请稍后登录', isSuccess: false, data: '' });
          if (!response) {
            resolve({ msg: '账号密码错误，请重新登录', isSuccess: false, data: '' });
          } else {
            const my_token = this.app.jwt.sign({
              username: response.username,
              uid: response.uid,
            }, this.app.config.jwt.secret, { expiresIn: '24h' });
            response.lastlogintime = new Date();
            response.save();
            resolve({
              msg: '登录成功',
              data: {
                token: my_token,
                uid: response.uid,
                lastlogintime: response.lastlogintime,
                username: response.username,
              },
              isSuccess: true,
            });
          }
        });
      } else {
        resolve({
          msg: '提交表单错误，请重新登录',
          data: '',
          isSuccess: false,
        });
      }
    });
  }

  // 创建新用户
  async register(userInfo) {
    const { ctx } = this;
    return new Promise(resolve => {
      ctx.model.Counters.findAndModify({ _id: 'userId' }, [],
        { $inc: { count: 1 } }, { new: true, upsert: true }, async function(err, result) {
          // index => 自增id = result.value.count
          const id = result.value.count;
          const info_params = {
            uid: id,
            createtime: new Date(),
            lastlogintime: new Date(),
            username: userInfo.username,
            password: userInfo.password,
          };
          ctx.model.User.findOne({ username: info_params.username }, (err, response) => {
            if (response) {
              resolve({ msg: '已存在该客户名，请重新输入', isSuccess: false, data: '' });
            } else {
              ctx.model.User.create(info_params, (err, res) => {
                if (err) resolve({ msg: '创建新客户报错', isSuccess: false, data: '' });
                resolve({
                  msg: '注册成功',
                  data: res,
                  isSuccess: true,
                });
              });
            }
          });
        });
    });
  }

  // 获取用户列表
  async getUserList() {
    const { ctx } = this;
    return new Promise(resolve => {
      ctx.model.User.find({ }, (err, response) => {
        if (err) resolve({ msg: 'getUserList Error', isSuccess: false, data: '' });
        resolve({
          msg: '获取用户列表成功',
          isSuccess: true,
          data: response,
        });
      });
    });
  }
}
module.exports = UserService;
