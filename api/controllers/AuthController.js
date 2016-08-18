var passport = require('passport');

module.exports = {

	login: function(req, res) {
		passport.authenticate('local', function(err, user, info){
			if ((err) || (!user)) {
				return res.send({
					message: info.message,
					user: user,
					text: 'failed'
				});
			}

			req.logIn(user, function(err){
				if (err) {
					return res.send(err);
				}
				return res.send ({
					message: info.message,
					user: user
				});
			});
		})(req, res);
	},

	register: function(req, res){
		passport.authenticate('register', function(err, user, info){
			if ((err) || (!user)) {
				return res.send({
					message: info.message,
					user: user,
					text: 'failed'
				});
			}

			req.logIn(user, function(err) {
				if (err) {
					return res.send(err);
				}
				return res.send ({
					message: info.message,
					user: user
				});
			});
		})(req, res);
	},

	facebook: function(req, res) {
		passport.authenticate('facebook', { failureRedirect: '/login', scope: ['email'] }, function(err, user, info) {
			if ((err) || (!user)) {
				return res.send({
					message: info.message,
					user: user,
					text: 'failed'
				});
			}

			req.logIn(user, function(err) {
				if (err) {
					return res.send(err);
				}
				return res.send ({
					message: info.message,
					user: user
				});
			});
		})(req, res);
	},

	google: function(req, res){
		passport.authenticate('google', { scope: ['profile','email'] }, function(err, user, info){
			if ((err) || (!user)) {
				return res.send({
					message: info.message,
					user: user,
					text: 'failed'
				});
			}

			req.logIn(user, function(err) {
				if (err) {
					return res.send(err);
				}
				return res.send ({
					message: info.message,
					user: user
				});
			});
		})(req, res);
	},

	logout: function(req, res){
		req.logout();
		res.redirect('/');
	}
};
