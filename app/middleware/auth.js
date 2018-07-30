'use strict';
// 判断用户当前登录是否过期
function checkUserLoginTime(user) {
  let bool = true;
  const now_time = new Date().getTime();
  const old_time = new Date(user.lastlogintime).getTime();
  const cel = (now_time - old_time) / 1000 / 3600;
  // const cel = (now_time - old_time) / 1000;
  if (cel > 2) {
    bool = false;
  }
  return bool;
}

module.exports = options => {
  return function* auth(next) {
    yield next;
    if (this.path === '/' || /^\/api/.test(this.path)) {
      return;
    }
    if (!this.session.user || !checkUserLoginTime(this.session.user)) {
      this.session.user = null;
      this.redirect('/');
    }
  };
};
