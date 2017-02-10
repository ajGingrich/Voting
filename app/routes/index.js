'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');

module.exports = function (app, passport) {

	var userID = null;

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			if (userID == null) {
                userID = "logged in";
                //console.log(userID);
			}
			return next();
		}
		else {
            res.render(path + '/public/index.ejs', {
                userID: userID
            });
		}
	}

	var clickHandler = new ClickHandler();

	app.route('/')
        .get(isLoggedIn, function (req, res)  {
        res.render(path + '/public/index.ejs', {
        	userID: userID
		});
    });

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			userID = null;
			//console.log(userID);
			res.redirect('/');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.render(path + '/public/profile.ejs');
		});

    app.route('/createPoll')
        .get(isLoggedIn, function (req, res) {
            res.render(path + '/public/createPoll.ejs', {
            	userID: userID
			});
        });

    app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/'
		}));

	app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.post(isLoggedIn, clickHandler.addClick)
		.delete(isLoggedIn, clickHandler.resetClicks);
};
