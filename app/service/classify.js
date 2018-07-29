'use strict';
// app/service/user.js
const Service = require('egg').Service;

class ClassifyService extends Service {

  // 获取分类列表
  async getDataList() {
    const { ctx } = this;
    return new Promise(resolve => {
      ctx.model.Classify.find({}, (err, res) => {
        if (err) resolve({ msg: '获取数据列表失败,请刷新重试', isSuccess: false, data: '' });
        resolve({
          msg: '数据列表获取成功',
          data: res,
          isSuccess: true,
        });
      });
    });
  }

  // 创建新分类
  async create(clsname) {
    const { ctx } = this;
    return new Promise(resolve => {
      ctx.model.Counters.findAndModify({ _id: 'classifyId' }, [],
        { $inc: { count: 1 } }, { new: true, upsert: true }, async function(err, result) {
          // index => 自增id = result.value.count
          const id = result.value.count;
          const info_params = {
            cid: id,
            name: clsname,
            createtime: new Date(),
            sum: 0,
            size: 0,
          };
          ctx.model.Classify.findOne({ name: clsname }, (err, response) => {
            if (err) resolve({ msg: '创建错误', isSuccess: false, data: '' });
            if (response) {
              resolve({ msg: '已存在该分类名，请重新输入', isSuccess: false, data: '' });
            } else {
              ctx.model.Classify.create(info_params, (err, res) => {
                if (err) resolve({ msg: '创建新分类报错', isSuccess: false, data: '' });
                resolve({
                  msg: '分类创建成功',
                  data: res,
                  isSuccess: true,
                });
              });
            }
          });
        });
    });
  }

  // 删除分类
  async deleteCls(classid) {
    const { ctx } = this;
    return new Promise(resolve => {
      ctx.model.Classify.remove({ cid: classid }, (err, res) => {
        if (err) resolve({ msg: '删除错误', isSuccess: false, data: '' });
        resolve({
          msg: '分类删除成功',
          data: res,
          isSuccess: true,
        });
      });
    });
  }

}
module.exports = ClassifyService;
