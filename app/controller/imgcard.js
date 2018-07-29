'use strict';

const Controller = require('egg').Controller;

class ImgcardController extends Controller {

  async index() {
    const { ctx, service } = this;
    const dataList = await service.imgcard.getDataList();
    // 这里需要注意的是，给模板传的参数是一个对象,然后就可以在模板中通过对象中的 key 键来获取相应的值
    await ctx.render('imgcard.html', { dataList: dataList.data, type: 'list' });
  }

  async edit() {
    const { ctx, service } = this;
    const dataList = await service.classify.getDataList();
    await ctx.render('imgcard.html', { clslist: dataList.data, type: 'edit' });
  }

  // 创建图片组
  async create() {
    const { ctx } = this;
    const callback = await ctx.service.imgcard.createFilesToDir(ctx.req);
    ctx.body = callback;
  }

  // 删除一个分类
  async delete() {
    const { ctx, service } = this;
    // 通过ctx上下文拿到请求的相关字段
    const gid = ctx.request.body.gid;
    const callback = await service.imgcard.delete(gid);
    ctx.body = callback;
  }

}

module.exports = ImgcardController;
