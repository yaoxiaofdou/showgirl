'use strict';
const Controller = require('egg').Controller;
const moment = require('moment');

class UserController extends Controller {

  async index() {
    const { ctx, service } = this;
    const callback = await service.user.getUserList();
    const list = callback.data;
    // 这里需要注意的是，给模板传的参数是一个对象,然后就可以在模板中通过对象中的 key 键来获取相应的值
    await ctx.render('user.html', { dataList: list });
  }

  async api_login() {
    const { ctx, service } = this;
    // 通过ctx上下文拿到请求的相关字段
    const u_name = ctx.request.body.username;
    const p_word = ctx.request.body.password;
    const user = {
      username: u_name,
      password: p_word,
    };
    const callback = await service.user.login(user);
    ctx.body = callback;
  }

  async api_register() {
    const { ctx, service } = this;
    // 通过ctx上下文拿到请求的相关字段
    const u_name = ctx.request.body.username;
    const p_word = ctx.request.body.password;
    const user = {
      username: u_name,
      password: p_word,
    };
    const callback = await service.user.register(user);
    console.log(callback);
    ctx.body = callback;
  }

}

module.exports = UserController;
