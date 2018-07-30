'use strict';

module.exports = appInfo => {
  const config = exports = {};

  config.baseUrl = 'http://localhost:7001/'; // 开发
  // config.baseUrl = 'https://www.5s20.com/'; // 生产

  // jwt
  config.jwt = {
    secret: 'showgirltime',
  };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1531734986740_820';

  config.view = {
    mapping: {
      '.html': 'ejs',
    },
  };

  // 重置session过期时间
  config.session = {
    renew: true,
  };

  // add your config here 中间
  config.middleware = [ 'auth' ];

  /**
   * @see http://mongodb.github.io/node-mongodb-native/2.2/api/Db.html#createCollection
   */
  config.mongoose = {
    url: process.env.EGG_MONGODB_URL || 'mongodb://127.0.0.1:27017/showgirltime',
    options: {
      server: {
        poolSize: 20,
      },
    },
  };

  // 关闭csrf
  config.security = {
    // csrf: {
    //   // enable: true,
    //   // ignoreJSON: true,
    //   queryName: '_csrf',
    //   bodyName: '_csrf',
    // },
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    methodnoallow: {
      enable: false,
    },
    // 白名单
    domainWhiteList: [ 'http://localhost:7001' ],
  };

  config.cors = {
    origin: '*', // Access-Control-Allow-Origin 加这个就忽略 domainWhiteList（白名单）
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  };

  // exports.session = {
  //   key: 'EGG_SESS',
  //   maxAge: 24 * 3600 * 1000, // 1 天
  //   httpOnly: true,
  //   encrypt: true,
  // };

  // 加载 errorHandler 中间件
  // config.middleware = [ 'errorHandler' ];

  return config;
};
