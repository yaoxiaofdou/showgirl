'use strict';

module.exports = options => {
  return function* auth(next) {
    yield next;
    if (this.path === '/' || this.path === '/login' || /^\/api/.test(this.path)) {
      return;
    }
    if (!this.session.user.username) {
      this.redirect('/login');
    }
  };
};
