'use strict';

const fs = require('fs');
const path = require('path');
const Service = require('egg').Service;

class UtilsService extends Service {

  // 判断文件路径是否存在 异步
  async fsExists(path) {
    try {
      fs.access(path, fs.F_OK);
    } catch (e) {
      return false;
    }
    return true;
  }

  // 判断文件路径是否存在 同步
  async fsExistsSync(path) {
    try {
      fs.accessSync(path, fs.F_OK);
    } catch (e) {
      return false;
    }
    return true;
  }

  // 递归创建目录 异步方法
  async mkdirs(dirname) {
    if (fs.exists(dirname)) {
      return true;
    } else {
      if (this.mkdirs(path.dirname(dirname))) {
        fs.mkdir(dirname);
        return true;
      }
    }
  }

  // 递归创建目录 同步方法
  async mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
      return true;
    } else {
      if (this.mkdirsSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
      }
    }
  }

}
module.exports = UtilsService;
