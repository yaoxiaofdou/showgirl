'use strict';

const async = require('async');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const awaitWriteStream = require('await-stream-ready').write;
const sendToWormhole = require('stream-wormhole');
const Service = require('egg').Service;

class ImgCardService extends Service {

  // 获取图片组渲染列表
  async getDataList() {
    const { ctx } = this;
    return new Promise(resolve => {
      ctx.model.Imgcard.find({}, (err, response) => {
        if (err) resolve({ msg: '获取图片组列表失败', isSuccess: false, data: err });
        resolve({
          msg: '图片组获取成功',
          data: response,
          isSuccess: true,
        });
      });
    });
  }

  // 微信   ----    获取分类对应的列表数据
  async wx_getClsDataList(params) {
    const { ctx } = this;
    return new Promise(resolve => {
      const query = ctx.model.Imgcard.find({ cid: (params.cls - 0) });
      const paga = {
        p: (params.page) - 0 - 1 >= 0 ? (params.page) - 0 - 1 : 0,
        s: (params.pageSize) - 0,
      };
      // console.log(params);
      ctx.model.Imgcard.count({ cid: (params.cls - 0) }, (c_err, count) => {
        query.skip(paga.p * paga.s)
          .limit(paga.s)
          .exec('find', (err, response) => {
            if (err) resolve({ msg: '微信图片组获取失败', isSuccess: false, data: err });
            resolve({
              msg: '微信图片组获取成功',
              data: {
                page: params.page - 0,
                pageSize: params.pageSize - 0,
                pageCount: Math.ceil(count / params.pageSize),
                list: response,
              },
              isSuccess: true,
            });
          });
      });
    });
  }

  // 查看图片组信息
  async getImgCard(id) {
    const { ctx } = this;
    return new Promise(resolve => {
      ctx.model.Imgcard.findOne({ gid: id }, (err, response) => {
        if (err) resolve({ msg: '获取图片组失败', isSuccess: false, data: err });
        // 累计一次该图片组的被浏览次数加一
        response.look += 1;
        response.save((err, save_data) => {
          resolve({
            msg: '图片组信息获取成功',
            data: save_data,
            isSuccess: true,
          });
        });
      });
    });
  }

  // 图片组点赞功能
  async postCardStart(id) {
    const { ctx } = this;
    return new Promise(resolve => {
      // console.log(ctx.session.user.uid);
      ctx.model.Imgcard.findOne({ gid: id }, (err, response) => {
        if (err) resolve({ msg: '获取图片组失败', isSuccess: false, data: err });
        const o_id = response.startIds.find(i => i === ctx.session.user.uid);
        // console.log(response.startIds);
        if (!o_id) {
          response.startIds.push(ctx.session.user.uid);
          // 累计一次该图片组的被浏览次数加一
          response.start += 1;
          response.save((err, save_data) => {
            resolve({
              msg: '图片组点赞成功',
              data: save_data,
              isSuccess: true,
            });
          });
        } else {
          resolve({
            msg: '您已经给人家点过赞咯，不要重复啦',
            data: '',
            isSuccess: false,
          });
        }
      });
    });
  }

  // 查看图片组详情
  async gotodetail(params) {
    const { ctx } = this;
    return new Promise(resolve => {
      ctx.model.Imgs.find({ gid: params.gid, cid: params.cid }, (err, response) => {
        if (err) resolve({ msg: '获取图片组详情列表失败', isSuccess: false, data: err });
        resolve({
          msg: '图片组详情获取成功',
          data: response,
          isSuccess: true,
        });
      });
    });
  }

  async parse(req) {
    const form = new formidable.IncomingForm();
    return new Promise(resolve => {
      form.parse(req, (err, fields, files) => {
        resolve({ fields, files });
      });
    });
  }

  // 把接收到的文件分类，写入对应的文件夹子
  async createFilesToDir(ctxreq) {
    const { ctx, logger } = this;
    // 上传图片保存服务器
    const extraParams = await this.parse(ctxreq);
    const { multipleFile, imgTitle, clsId } = extraParams && extraParams.fields;
    logger.info(multipleFile, imgTitle);
    const urls = []; // upload files object
    for (const key in extraParams.files) {
      const file = extraParams.files[key];
      logger.info('file.name', file.name);
      // logger.info('imgTitle', imgTitle);
      const stream = fs.createReadStream(file.path);
      // 定义路径
      const dirPath = 'app/public/upload/' + imgTitle;
      const ImgName = new Date().getTime() + '-' + clsId + '-' + key + '.' + file.type.match(/\w+$/)[0]; // file.name;
      // 判断文件夹
      if (ctx.service.utils.fsExistsSync(dirPath)) {
        ctx.service.utils.mkdirsSync(dirPath);
      }
      // 写入图片 ---- 这个图片路径需要重新设计
      // this.config.baseUrl + public/upload/%E4%BA%91%E8%A3%B3%E8%B4%B5%E5%B7%9E/1532766281123-21-file1.png
      // 图片保存文件夹
      const target = path.join(this.config.baseDir, 'app/public/upload/' + imgTitle, ImgName);
      // 图片显示路径
      const img_href = this.config.baseUrl + 'public/upload/' + imgTitle + '/' + ImgName;
      const writeStream = fs.createWriteStream(target);
      try {
        await awaitWriteStream(stream.pipe(writeStream));
      } catch (err) {
        await sendToWormhole(stream);
        throw err;
      }
      urls.push({
        // img: file,
        name: ImgName, //  String      图片名称
        src: img_href, //  String      图片路径
        size: file.size, //  Number      图片大小
        uploadTime: new Date(), // Date  图片上传时间
      });
    }

    // 处理服务器保存图片后的得到的图片路径
    return new Promise(resolve => {
      ctx.model.Imgcard.findOne({ name: imgTitle }, (error, response) => {
        if (error) resolve({ msg: '创建新图片组失败', isSuccess: false, data: error });
        if (!response) {
          ctx.model.Counters.findAndModify({ _id: 'imgcardId' }, [],
            { $inc: { count: 1 } }, { new: true, upsert: true }, async function(c_err, result) {
              if (c_err) resolve({ msg: '创建新图片组自增id失败', isSuccess: false, data: c_err });
              const card_id = result.value.count;
              const imgcard_params = {
                cid: clsId,
                gid: card_id,
                name: imgTitle,
                defaultimg: urls[0].src, // 默认图就取上传的第一张图
                createtime: new Date(),
                sum: urls.length,
                size: urls.reduce((pre, next) => {
                  pre += next.size - 0;
                  return pre;
                }, 0), // 统计总图片大小
                start: 0,
                look: 0,
              };
              ctx.model.Imgcard.create(imgcard_params, (card_err, card_response) => {
                if (card_err) resolve({ msg: '创建新图片组保存失败', isSuccess: false, data: card_err });
                // 图片组创建成功 --- 通知图片组所再分类更新
                ctx.model.Classify.findOne({ cid: clsId }, (err, cls_res) => {
                  if (err) resolve({ msg: '图片组创建成功，更新分类总数错误', isSuccess: false, data: '' });
                  cls_res.sum += 1;
                  cls_res.size += imgcard_params.size;
                  cls_res.save();
                });
                // 这里要继续接下去创建各条图片数据
                async.map(urls, (item_img, callback) => {
                  ctx.model.Counters.findAndModify({ _id: 'imgsId' }, [],
                    { $inc: { count: 1 } }, { new: true, upsert: true }, async function(img_err, img_result) {
                      if (img_err) resolve({ msg: '创建新图片组保存失败', isSuccess: false, data: img_err });
                      const img_id = img_result.value.count;
                      const img_params = {
                        cid: card_response.cid, //    Number      所属分类id
                        gid: card_response.gid, //    Number      图片组id
                        imgid: img_id, //  Number      图片id
                        src: item_img.src, //  String      图片路径
                        size: item_img.size, //  Number      图片大小
                        name: item_img.name, //  String      图片名称
                        uploadTime: item_img.uploadTime, // Date  图片上传时间
                      };
                      ctx.model.Imgs.create(img_params, (uimg_err, uimg_res) => {
                        if (uimg_err) {
                          callback(null, { type: 'error', msg: '上传失败', data: uimg_err });
                        } else {
                          callback(null, { type: 'success', msg: '单图上传成功', data: uimg_res });
                        }
                      });
                    });
                }, (err, results) => {
                  resolve({
                    msg: '创建新图片组成功',
                    data: results,
                    isSuccess: true,
                  });
                });
              });
            });
        } else {
          resolve({ msg: '已有该图片组名称，请更换后提交', isSuccess: false, data: error });
        }
      });
    });

    // return { isSuccess: true, data: urls, msg: '上传图片成功' };
  }

  // 删除
  async delete(id) {
    const { ctx } = this;
    return new Promise(resolve => {
      ctx.model.Imgcard.findOne({ gid: id }, (f_err, f_response) => {
        if (f_err) resolve({ msg: '删除图片组列表失败, 没有找到该条数据', isSuccess: false, data: f_err });
        ctx.model.Imgcard.remove({ gid: id }, (err, response) => {
          if (err) resolve({ msg: '删除图片组列表失败', isSuccess: false, data: err });
          // 图片组删除成功 --- 通知图片组所再分类更新
          ctx.model.Classify.findOne({ cid: f_response.cid }, (err, cls_res) => {
            if (err) resolve({ msg: '删除图片组列表成功，更新分类总数错误', isSuccess: false, data: '' });
            cls_res.sum -= 1;
            cls_res.size -= f_response.size;
            cls_res.save();
          });
          resolve({
            msg: '删除图片组列表成功',
            data: response,
            isSuccess: true,
          });
        });
      });
    });
  }

}
module.exports = ImgCardService;
