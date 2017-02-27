'use strict';

var path = process.cwd();
var PollHandler = require(path + '/app/controllers/pollHandler.server.js');
var Polls = require('../models/polls.js');

module.exports = function (app, passport) {

	var userID = null;
    var polls = [];

	function isLoggedIn (req, res, next) {

		if (req.isAuthenticated()) {
			if (userID == null) {
                userID = "logged in";
			}
            Polls.find({}, function(err, data) {
                if (err) throw err;
                polls = data;
            });
			return next();
		}
		else {
            Polls.find({}, function(err, data) {
                if (err) throw err;
                polls = data;
                res.render(path + '/public/index.ejs', {
                    userID: userID,
                    polls: polls
                });
            });

		}
	}

	var pollHandler = new PollHandler();

	app.route('/')
        .get(isLoggedIn, function (req, res)  {
        res.render(path + '/public/index.ejs', {
        	userID: userID,
			polls: polls
		});
    });

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			userID = null;
			res.redirect('/');
		});

	app.route('/profile')
		.get(pollHandler.findPolls);

	////get to display the page, post to send the form to the DB
    app.route('/createPoll')
        .get(pollHandler.newPoll)
		.post(pollHandler.addPoll);

    app.route('/displayPoll/:id')
        .get(function (req, res) {
        	//use the id to find the appropriate poll
			var id = req.params.id;
			//console.log(userID);
			var poll = {};
			Polls.findById(id, function(err, data) {
				if (err) throw err;
				poll = data;
                res.render(path + '/public/displayPoll.ejs', {
                    userID: userID,
                    poll: poll
                });
        	});
        });

    app.route('/deletePoll/:id')
		.get(pollHandler.deletePoll);

    app.route('/vote/:pollId/:optionId')
		.post(pollHandler.vote);

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
