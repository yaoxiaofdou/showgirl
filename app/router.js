'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.default);

  // 首页
  router.get('/home', controller.home.index);
  router.get('/api/getlist', app.jwt, controller.home.api_getlist); // use old api app.jwt

  // 登录注册
  router.post('/api/login', controller.user.api_login);// 登录
  router.post('/api/register', controller.user.api_register);// 注册

  // 修改页
  router.get('/user', controller.user.index);

  // 分类
  router.get('/classify', controller.classify.index);
  router.get('/classify/edit', controller.classify.edit);
  router.post('/classify/create', controller.classify.create);
  router.post('/classify/delete', controller.classify.delete);

  // 图片组
  router.get('/imgcard', controller.imgcard.index);
  router.get('/imgcard/edit', controller.imgcard.edit);
  router.get('/imgcard/detail', controller.imgcard.detail);
  router.post('/imgcard/create', controller.imgcard.create);
  router.post('/imgcard/delete', controller.imgcard.delete);
  router.post('/imgcard/start', controller.imgcard.start);

  // -------------- wechat 专用接口
  router.post('/api/wx_login', controller.user.api_wx_login); // wx 登录
  router.get('/api/wx_cls', controller.classify.we_getClsList); // 获取分类
  router.get('/api/wx_getClsDataList', controller.imgcard.wx_getClsDataList); // 获取分类图片组
  router.get('/api/wx_getImgsDetail', controller.imgcard.wx_getImgsDetail); // 获取分类图片组详情
  router.get('/api/wx_getCardInfo', controller.imgcard.wx_getCardInfo); // 获取分类图片组详情
};
