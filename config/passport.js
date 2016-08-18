var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy,
FacebookStrategy = require('passport-facebook').Strategy,
GoogleStrategy = require('passport-google-oauth20').Strategy,
bcrypt = require('bcrypt');

// Take user object, store information in a session
passport.serializeUser(function(user, done) {
  console.log(user);
  done(null, user.id);
});

// Take information from the session, check if the session is still valid
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user){
    done(err, user);
  });
});

// Login a user locally
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
},
function(email, password, done) {

  User.findOne({ email: email }, function (err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, { message: 'Incorrect email.' });
    }

    bcrypt.compare(password, user.password, function (err, res) {
      if (!res) {
        if(user.facebookId || user.googleID) {
          console.log('account');
          return done(null, false, {
            message: 'Looks like you used Facebook or Google to sign in. If you want to sign in normally, register with us and provide a password, and we will link it to your account'
          });
        } else {
          return done(null, false, {
            message: 'Invalid Password'
          });
        }
      }
      var returnUser = {
        email: user.email,
        createdAt: user.createdAt,
        id: user.id
      };
      return done(null, returnUser, {
        message: 'Logged In Successfully'
      });
    });
  });
}
));

// Register a new local user
passport.use('register', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
},
function(req, email, password, done){
  User.findOne({ email: email}, function(err, user){
    if(err) {
      return done(err, false, {message: 'Something went wrong'});
    }

    if(user){
      if(user.facebookId){
        console.log('Found a Facebook user');
        User.update({facebookId: user.facebookId}, {password: password, username: req.body.username}, function(err, user){
          if(err) return done(err, false, {message: 'Tried to add a password to your account but something went wrong'});

          // Create object to send back
          var returnUser = {
            email: user[0].email,
            createdAt: user[0].createdAt,
            id: user[0].id
          }
          return done(null, returnUser, { message: 'You were already registered with Facebook but we added the password to your account and assigned a username.  You can login either way now'});
        })
      } else {
        return done(null, false, {message: 'User already exists'});
      }
    } else {
      User.create({email: email, username: req.body.username, password: password}, function(err, user){
        if(err) return done(err, false, {message: 'Something went wrong'});
        var returnUser = {
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
          id: user.id
        }
        return done(null, returnUser, {message: 'User created Successfully'});
      })
    }
  })
}))

// Register/Login a user via Facebook
passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: 'http://HOSTNAME:PORT/auth/facebook/callback',
  // Get additional fields.  All fields available at https://developers.facebook.com/docs/graph-api/reference/v2.7/user
  profileFields: ['email','picture','name']
},
function(accessToken, refreshToken, profile, done) {
  User.findOne({ email: profile.emails[0].value}, function(err, user){
    if (err) return done(err);
    // No user found, then create an account
    if (!user || user == 'false') {
      var username = profile.name.givenName + ' ' + profile.name.familyName;
      User.create({facebookId: profile.id, email: profile.emails[0].value, username: username}, function(err, user){
        if(err) return done(err, false, {message: 'Something went wrong'});

        // Create object to send back
        var returnUser = {
          email: user.email,
          createdAt: user.createdAt,
          id: user.id
        }
        return done(null, returnUser, { message: 'Facebook user created'});
      })
    } else {
      // Found an account, link account to Facebook ID
      User.update({email: user.email}, {facebookId: profile.id}, function(err, user){
        if(err) return done(err, false, {message: 'Something went wrong'});

        // Create object to send back
        var returnUser = {
          email: user[0].email,
          createdAt: user[0].createdAt,
          id: user[0].id
        }
        return done(null, returnUser, { message: 'User already registered, linked Facebook account'});
      })
    }
  })
}
));

passport.use(new GoogleStrategy({
  // Make sure you add the Google+ API to your application
  clientID: GOOGLE_APP_ID,
  clientSecret: GOOGLE_APP_SECRET,
  // Google doesn't allow the use of localhost in the callbackURL
  // Visit www.displaymyhostname.com and use your host name in the application and callbackURL below
  callbackURL: 'http://HOSTNAME.com:PORT/auth/google/callback'
},
function(accessToken, refreshToken, profile, done){
  User.findOne({ email: profile.emails[0].value}, function(err, user){
    if (err) return done(err);
    // No user found, then create an account
    if (!user || user == 'false') {
      var username = profile.name.givenName + ' ' + profile.name.familyName;
      User.create({googleId: profile.id, email: profile.emails[0].value, username: username}, function(err, user){
        if(err) return cb(err, false, {message: 'Something went wrong'});

        // Create object to send back
        var returnUser = {
          email: user.email,
          createdAt: user.createdAt,
          id: user.id
        }
        return cb(null, returnUser, { message: 'Google user created'});
      })
    } else {
      // Found an account, link account to Facebook ID
      User.update({email: user.email}, {googleId: profile.id}, function(err, user){
        if(err) return done(err, false, {message: 'Something went wrong'});

        // Create object to send back
        var returnUser = {
          email: user[0].email,
          createdAt: user[0].createdAt,
          id: user[0].id
        }
        return done(null, returnUser, { message: 'User already registered, linked Google account'});
      })
    }
  })
}));
