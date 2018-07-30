'use strict';

const Controller = require('egg').Controller;

// home 显示数据库中图片数据列表
// post 用来对数据库中图片的增删改查
// user 用来控制用户登录等

class HomeController extends Controller {

  // 默认页，需要判断当前用户是否登录
  async default() {
    const { ctx } = this;
    await ctx.render('home.html', { type: 'login' });
    // await this.ctx.render('home.html');
  }

  async index() {
    // const dataList = await this.service.post.findAll();
    const d_dataList = [
      { _id: 'i1001001', name: '章三图1' },
      { _id: 'i1001002', name: '章三图2' },
      { _id: 'i1001003', name: '章三图3' },
      { _id: 'i1001004', name: '章三图4' },
    ];
    // 这里需要注意的是，给模板传的参数是一个对象,然后就可以在模板中通过对象中的 key 键来获取相应的值
    await this.ctx.render('home.html', { dataList: d_dataList, type: 'home' });
  }

  // 获取数据列表
  * api_getlist() {
    this.ctx.body = 'Hello world';
  }

}

module.exports = HomeController;
