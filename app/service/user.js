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

            // 用户数据写入 session
            ctx.session.user = {
              token: my_token,
              uid: response.uid,
              lastlogintime: response.lastlogintime,
              username: response.username,
            };

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

  async wx_login(wx_user) {
    const { ctx } = this;
    return new Promise(resolve => {
      ctx.model.User.findOne({ openid: wx_user.openid }, (err, response) => {
        if (err) resolve({ msg: '登录接口报错，请稍后登录', isSuccess: false, data: '' });
        console.log(response);
        console.log(wx_user);
        if (!response) {
          const user_info = {
            username: wx_user.username,
            openid: wx_user.openid,
            language: wx_user.language,
            country: wx_user.country,
            city: wx_user.city,
            province: wx_user.province,
            lastlogintime: new Date(),
            avatarUrl: wx_user.avatarUrl,
          };
          ctx.model.User.create(user_info, (err, res) => {
            resolve({
              msg: '创建新的微信用户成功',
              isSuccess: true,
              data: {
                lastlogintime: res.lastlogintime,
                username: res.username,
              },
            });
          });
        } else {
          response.lastlogintime = new Date();
          response.save();
          resolve({
            msg: '该用户是老用户，登录成功',
            data: {
              lastlogintime: response.lastlogintime,
              username: response.username,
            },
            isSuccess: true,
          });
        }
      });
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
