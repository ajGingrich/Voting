'use strict';

var Polls = require('../models/polls.js');
var path = process.cwd();

function pollHandler () {

    this.newPoll = function (req, res) {
        res.render(path + '/public/createPoll.ejs', {
            userID: "logged-in"
        });
    };

    ///add new poll if logged in
	this.addPoll = function (req, res) {

		console.log(req.body);
		console.log('testie');
	    /*///get form Data
	    var pollName = 'test1';
	    var option1 = 'option1 yeaaaaa';
	    var option2 = 'option2 work dammit';

	    var poll = {};
        var pollId = 'poll1';

        //console.log(newPoll);

	    poll[pollId] = {
	        name: pollName,
            option1: {name: option1, votes: 0},
            option2: {name: option2, votes: 0}
	    };

		Polls
        	.findOneAndUpdate({ 'github.id': req.user.github.id }, { $set: poll}, {new: true})
			.exec(function (err, result) {
					if (err) { throw err; }
					//res.json(result.plswork);
					//res.json(result.nbrClicks.clicks);
				}
			);*/
        res.redirect('/');
	};

}

module.exports = pollHandler;
