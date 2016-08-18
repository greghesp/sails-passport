var bcrypt = require('bcrypt');

module.exports = {

  connection: 'someMongodbServer',

  attributes: {
    facebookId: {
      type: 'string',
      unique: true
    },
    googleId: {
      type: 'string',
      unique: true
    },
    username: {
      type: 'string',
      unique: true
    },
    email: {
      type: 'email',
      required: true,
      unique: true,
    },
    password: {
      type: 'string',
      minLength: 6,
    },
    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    }
  },
  beforeCreate: function(user, cb) {
    if(user.password){
      bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(user.password, salt, function(err, hash){
          if(err) {
            console.log(err);
            cb(err)
          } else {
            user.password = hash;
            cb();
          }
        });
      });
    } else {
      cb();
    }
  },
  beforeUpdate: function(user, cb){
    if(user.password){
      bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(user.password, salt, function(err, hash){
          if(err) {
            console.log(err);
            cb(err)
          } else {
            user.password = hash;
            cb();
          }
        });
      });
    } else {
      cb();
    }
  }
};
