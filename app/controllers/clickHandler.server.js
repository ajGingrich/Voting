'use strict';

var Users = require('../models/users.js');
var pollNumber = 1;

function ClickHandler () {

	this.getClicks = function (req, res) {
		Users
			.findOne({ 'github.id': req.user.github.id }, { '_id': false })
			.exec(function (err, result) {
				if (err) { throw err; }
                //res.json(result.nbrClicks.clicks);
				//res.json(result.test);
			});
	};



	this.addClick = function (req, res) {

	    ///get form Data
	    var pollName = 'test1';
	    var option1 = 'option1 yeaaaaa';
	    var option2 = 'option2 work dammit';

	    var poll = {};
        var pollId = 'poll' + pollNumber.toString();

        //console.log(newPoll);

	    poll[pollId] = {
	        name: pollName,
            option1: {name: option1, votes: 0},
            option2: {name: option2, votes: 0}
	    };

		Users
        	.findOneAndUpdate({ 'github.id': req.user.github.id }, { $set: poll}, {new: true})
			.exec(function (err, result) {
					if (err) { throw err; }
					//res.json(result.plswork);
					//res.json(result.nbrClicks.clicks);
				}
			);
		pollNumber++;
	};

	this.resetClicks = function (req, res) {
		Users
			.findOneAndUpdate({ 'github.id': req.user.github.id }, { 'nbrClicks.clicks': 0 })
			.exec(function (err, result) {
					if (err) { throw err; }

                    //res.json(result.nbrClicks.clicks);
					//res.json(result.test);
				}
			);
	};

}

module.exports = ClickHandler;
