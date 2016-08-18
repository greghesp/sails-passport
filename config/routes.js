module.exports.routes = {

  '/': {
    view: 'homepage'
  },

  'get /login': {view: 'login'},

  'post /login': 'AuthController.login',

  '/logout': 'AuthController.logout',

  'get /register' : {view: 'register'},
  'post /register': 'AuthController.register',
};
