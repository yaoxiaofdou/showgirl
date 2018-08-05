'use strict';
const Controller = require('egg').Controller;

class ClassifyController extends Controller {

  async index() {
    const { ctx, service } = this;
    const dataList = await service.classify.getDataList();
    // 这里需要注意的是，给模板传的参数是一个对象,然后就可以在模板中通过对象中的 key 键来获取相应的值
    await ctx.render('classify.html', { dataList: dataList.data, type: 'list' });
  }

  async we_getClsList() {
    const { ctx, service } = this;
    const callback = await service.classify.getDataList();
    // 这里需要注意的是，给模板传的参数是一个对象,然后就可以在模板中通过对象中的 key 键来获取相应的值
    ctx.body = callback;
  }

  async edit() {
    await this.ctx.render('classify.html', { type: 'edit' });
  }

  // 创建一分类
  async create() {
    const { ctx, service } = this;
    // 通过ctx上下文拿到请求的相关字段
    const clsname = ctx.request.body.classname;
    const callback = await service.classify.create(clsname);
    ctx.body = callback;
  }

  // 删除一个分类
  async delete() {
    const { ctx, service } = this;
    // 通过ctx上下文拿到请求的相关字段
    const cid = ctx.request.body.cid;
    const callback = await service.classify.deleteCls(cid);
    ctx.body = callback;
  }

}

module.exports = ClassifyController;
