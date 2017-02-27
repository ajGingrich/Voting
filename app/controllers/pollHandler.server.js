'use strict';

var Polls = require('../models/polls.js');
var path = process.cwd();
var polls = null;
var http = require('http');

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

    //vote
    this.vote = function (req, res) {

        ////get the poll and option
        var pollId = req.params.pollId;
        var optionId = req.params.optionId;
        var userId;

        //get IP and make it userID if the user is not Logged in
        http.get({'host': 'api.ipify.org', 'port': 80, 'path': '/'}, function(resp) {
            resp.on('data', function(ip) {
                if (req.user != undefined) {
                    userId = req.user.github.id;
                }
                else {
                    userId = ip.toString();
                    console.log(userId);
                }
                Polls.find({
                    _id: pollId,
                    'usersVoted': {'name': userId}
                }, function(err, data) {
                    if (err) throw err;
                    ///if has already voted, don't let them do it again
                    if (data.length != 0) {
                        console.log("You have already voted. You can't do that you trickster");
                    }
                    else {
                        //add to vote count
                        Polls.update({
                            _id: pollId,
                            'options._id': optionId
                        } , {
                            $inc: {"options.$.count": 1, "votes": 1}
                        }, function( err, data) {
                            if (err) throw err;

                            //add to the list of voters
                            Polls.update({
                                _id: pollId
                            } , {
                                $push: {usersVoted: {"name": userId}}
                            }, function( err, data) {
                                if (err) throw err;
                            });
                        });
                    }
                    //find the poll and pass it to the page, but first check if user is logged-in or not
                    if (req.user != undefined) {
                        userId = req.user.github.id;
                    }
                    else {
                        userId = null;
                    }
                    Polls.findById(pollId, function(req, pollUsed) {
                        res.render(path + '/public/displayPoll.ejs', {
                            userID: userId,
                            poll: pollUsed
                        });
                    });
                });
            });
         });
    };

}

module.exports = pollHandler;
