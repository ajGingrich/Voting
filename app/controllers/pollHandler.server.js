'use strict';

var Polls = require('../models/polls.js');
var path = process.cwd();
var polls = null;

function pollHandler () {

    this.newPoll = function (req, res) {
        res.render(path + '/public/createPoll.ejs', {
            userID: "logged-in"
        });
    };

    ///add new poll if logged in
	this.addPoll = function (req, res) {

        //get the number of options
	    var numOptions = Object.keys(req.body).filter(function(propName) {
	        return propName.indexOf("option") === 0;
        });

	    //push all of the options
        var options= [];
	    for (var i=1; i <=numOptions.length; i++) {
	        options.push({name: req['body']['option' + i.toString()], count: 0})
        }

	    ///add form Data to Schema
		var newPoll = Polls({
            name: req.body.pollName,
            author: req.user.github.id,
            votes: 0,
            options: options
		});

        // save the poll
        newPoll.save(function(err) {
            if (err) throw err;
            console.log('Poll created!');

            Polls.find({}, function(err, data) {
                if (err) throw err;
                polls = data;
                res.render(path + '/public/index.ejs', {
                    userID: "test",
                    polls: polls
                });
            });
            //res.redirect('/');
        });

	};

	//find polls for user
	this.findPolls = function (req, res) {

        Polls.find({ author: req.user.github.id }, function(err, data) {
            if (err) throw err;

            polls = data;
            res.render(path + '/public/profile.ejs', {
                userID: "logged in",
                polls: polls
            });
        });

    };

    //delete poll
    this.deletePoll = function (req, res) {

      ///delete the poll
      var id = req.params.id;
      Polls.findByIdAndRemove(id, function(err) {
          if (err) throw err;
          console.log('Poll Deleted');
      });

      ///get all current polls in order to update
      Polls.find({}, function(err, data) {
            if (err) throw err;
            polls = data;
            res.render(path + '/public/profile.ejs', {
                userID: "test",
                polls: polls
            });
       });


    };


}

module.exports = pollHandler;
