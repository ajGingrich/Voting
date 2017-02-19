'use strict';

var path = process.cwd();
var PollHandler = require(path + '/app/controllers/pollHandler.server.js');
var bodyParser = require('body-parser');

module.exports = function (app, passport) {

	var userID = null;
	global.newPoll = null;

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

	var pollHandler = new PollHandler();

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
			res.redirect('/');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.render(path + '/public/profile.ejs');
		});

	////get to display the page, post to send the form to the DB
    app.route('/createPoll')
        .get(isLoggedIn, pollHandler.newPoll)
		.post(isLoggedIn, pollHandler.addPoll);

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


};
