const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Answers = require('../models/answers');
const Comments = require('../models/comments');
const Questions = require('../models/question');
const Votes = require('../models/votes');
const Bookmarks = require('../models/bookmarks');
const Notifications = require('../models/notifications');
const Followers = require('../models/follower');
var multer = require('multer');
const path = require("path");
const fs = require('fs');

//to get all answers for a particular question
router.get('/', (req, res) => {
    const id = req.query._id;
    Answers.find({ questionID: id })
        .exec()
        .then(docs => {
            console.log(docs);
            fs.appendFile('logs.txt', 'Status 200 - GET, All Answers Returned  '+Date.now()+'\n', function (err) {
                if (err) throw err;
                console.log('Updated!');
              });
            res.status(200).json(docs);

        }).catch(err => {
            console.log(err);
            fs.appendFile('logs.txt', 'Status 500 - GET, Error: Answers could not be Returned  '+Date.now()+'\n', function (err) {
                if (err) throw err;
                console.log('Updated!');
              });
            res.status(500).json({
                error: err
            })
        });
});


//to get one answers for a particular question to be displayed on homepage
router.get('/one', (req, res) => {
    const id = req.query._id;
    console.log(id);
    Answers.findOne({ questionID: id })
        .exec()
        .then(docs => {
            if (docs) {
                console.log(docs);
                fs.appendFile('logs.txt', 'Status 200 - GET/one, One Answer Returned  ' + Date.now() + '\n', function (err) {
                    if (err) throw err;
                    console.log('Updated!');
                  });
                res.status(200).json(docs);
            }
            else {
                fs.appendFile('logs.txt', 'Status 200 - GET/one,  ' +Date.now()+'\n', function (err) {
                    if (err) throw err;
                    console.log('Updated!');
                  });
                res.status(200).send('');
            }
            // res.status(200).json(docs);
        }).catch(err => {
            console.log(err);
            fs.appendFile('logs.txt', 'Status 500 - GET/one, Answer Not Returned  '+Date.now()+'\n', function (err) {
                if (err) throw err;
                console.log('Updated!');
              });
            res.status(500).json({
                error: err
            })
        });
});

const storage = multer.diskStorage({
    destination: "../frontend/public/uploads",
    filename: function (req, file, cb) {
        cb(null, "QUORA" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 999999999999999999999999 },
}).single("myImage");

//to create a new answer for a particular question
router.post('/', (req, res) => {

    //first find the question to the id
    var question = "Question";
    Questions.find({ _id: req.body._id }).then(result => {
        console.log("res",result)
        question = result[0].question;
    upload(req, res, (err) => {
        console.log("Request ---", req.body);

        if (!req.file) {
            filepath = ''
        }
        else {
            console.log("Request file ---", JSON.stringify(req.file));  //Here you get file.
            var filepath = req.file;
            var filepath = filepath.filename;
        }
        const answer = new Answers({
            _id: new mongoose.Types.ObjectId(),
            questionID: req.body._id,
            owner: req.body.email,
            answer: req.body.answer,
            isAnonymous: req.body.anonymousStatus,
            isCommentable: req.body.commentable,
            isVotable: req.body.votable,
            upVote: 0,
            downVote: 0,
            views: 0,
            fname: req.body.fname,
            lname: req.body.lname,
            image: req.body.image,
            question: question

        });


        if (req.body.answer) {
            Answers.find({ owner: req.body.email, questionID: req.body._id }).exec().then(result => {
                if (result.length > 0) {
                    fs.appendFile('logs.txt', 'Status 200 - POST, Already Answered  '+req.body.email+'  '+Date.now()+'\n', function (err) {
                        if (err) throw err;
                        console.log('Updated!');
                      });
                    res.status(200).json({
                        message: "You have already answered this question\n"
                    })
                }
                else {
                    answer.save()
                        .then(result => {
                            console.log(result);

                            Notifications.update({ questionID: req.body._id }, { $set: { answer: req.body.answer, view: true } }, { multi: true }).then(resultNew => {
                                console.log(resultNew);
                                fs.appendFile('logs.txt', 'Status 200 - POST, Successfully Answered  '+req.body.email+'  '+Date.now()+'\n', function (err) {
                                    if (err) throw err;
                                    console.log('Updated!');
                                  });
                                res.status(200).json({
                                    message: "Successfully Inserted!"
                                })
                            })


                        }).catch(err => {
                            fs.appendFile('logs.txt', 'Status 200 - POST, Unable to add answer  '+req.body.email+'  '+Date.now()+'\n', function (err) {
                                if (err) throw err;
                                console.log('Updated!');
                              });
                            res.status(200).json({
                                message: "Unable to add your answer"
                            })
                        });
                }
            })
        }
    });
});
});



//to edit an existing answer 
router.post('/edit', (req, res) => {
    console.log('ID: ', req.body._id);
    console.log('EMAIL', req.body.email);
    console.log('ANSWER ', req.body.answer);
    console.log('ANONYMITY ', req.body.anonymousStatus);
    Answers.update({ _id: req.body._id, owner: req.body.email }, { $set: { answer: req.body.answer, isAnonymous: req.body.anonymousStatus, isCommentable: req.body.commentable, isVotable: req.body.votable } })
        .exec()
        .then(result => {
            console.log(result);
            fs.appendFile('logs.txt', 'Status 200 - POST, Successfully Edited  '+req.body.email+'  '+Date.now()+'\n', function (err) {
                if (err) throw err;
                console.log('Updated!');
              });
            res.status(200).json({
                message: "Successfully Edited"
            });
        }).catch(err => {
            console.log(err);
            fs.appendFile('logs.txt', 'Status 200 - POST/edit, Could not be Edited  '+req.body.email+'  '+Date.now()+'\n', function (err) {
                if (err) throw err;
                console.log('Updated!');
              });
            res.status(200).json({
                message: "Could not be Edited"
            });
        });

});


//to upvote an answer
router.post('/upvote', (req, res) => {

    Votes.find({ answerID: req.body._id, owner: req.body.email }).then(result => {
        if (result.length > 0) {
            fs.appendFile('logs.txt', 'Status 200 - POST/upvote, You are not allowed to vote more than once  '+req.body.email+'  '+Date.now()+'\n', function (err) {
                if (err) throw err;
                console.log('Updated!');
              });
            res.status(200).json({
                flag: false,
                message: "You are not allowed to vote more than once"
            })
        }
        else {
            Answers.update({ _id: req.body._id }, { $inc: { upVote: 1, views: 1 } })
                .exec()
                .then(result => {
                    console.log(result);
                    const vote = new Votes({
                        _id: new mongoose.Types.ObjectId(),
                        answerID: req.body._id,
                        owner: req.body.email,
                        upVote: true,
                        downVote: false
                    });

                    vote.save().then(result => {
                        console.log(result);
                        fs.appendFile('logs.txt', 'Status 200 - POST/upvote, Flag True, Successfully Upvoted  '+req.body.email+'  '+Date.now()+'\n', function (err) {
                            if (err) throw err;
                            console.log('Updated!');
                          });
                        res.status(200).json({
                            flag: true,
                            message: "Successfully Upvoted"
                        })
                    }).catch(err => {
                        console.log(err);
                    })
                }).catch(err => {
                    console.log(err);
                });
        }
    }).catch(err => {
        console.log(err);
    })


});


//to downvote an answer
router.post('/downvote', (req, res) => {
    Votes.find({ answerID: req.body._id, owner: req.body.email }).then(result => {
        if (result.length > 0) {
            fs.appendFile('logs.txt', 'Status 200 - POST/downvote, Flag False, You are not allowed to vote more than once  '+req.body.email+'  '+Date.now()+'\n', function (err) {
                if (err) throw err;
                console.log('Updated!');
              });
            res.status(200).json({
                flag: false,
                message: "You are not allowed to vote more than once"
            })
        }
        else {
            Answers.update({ _id: req.body._id }, { $inc: { upVote: 1, views: 1 } })
                .exec()
                .then(result => {
                    console.log(result);
                    const vote = new Votes({
                        _id: new mongoose.Types.ObjectId(),
                        answerID: req.body._id,
                        owner: req.body.email,
                        upVote: false,
                        downVote: true
                    });

                    vote.save().then(result => {
                        console.log(result);
                        fs.appendFile('logs.txt', 'Status 200 - POST/downvote, Flag True, Successfully Downvoted  '+req.body.email+'  '+Date.now()+'\n', function (err) {
                            if (err) throw err;
                            console.log('Updated!');
                          });
                        res.status(200).json({
                            flag: true,
                            message: "Successfully Downvoted"
                        })
                    }).catch(err => {
                        console.log(err);
                    })
                }).catch(err => {
                    console.log(err);
                });


        }
    })
});


//to comment on an answer
router.post('/comment', (req, res) => {
    Answers.find({ _id: req.body._id }).exec().then(result => {
        if (result.length > 0) {
            const comment = new Comments({
                _id: new mongoose.Types.ObjectId(),
                answerID: req.body._id,
                comment: req.body.comment
            });

            if (req.body.comment) {
                comment.save().then(result => {
                    console.log(result);
                    fs.appendFile('logs.txt', 'Status 200 - POST/comment, Flag True, Successfully Commented  '+Date.now()+'\n', function (err) {
                        if (err) throw err;
                        console.log('Updated!');
                      });
                    res.status(200).json({
                        message: "Successfully Commented"
                    });
                }).catch(err => {
                    console.log(err);
                    fs.appendFile('logs.txt', 'Status 204 - POST/comment, Flag True, Comment Unsuccessful  '+Date.now()+'\n', function (err) {
                        if (err) throw err;
                        console.log('Updated!');
                      });
                    res.status(204).json({
                        message: "Comment Unsuccessful"
                    });
                })
            }
        }
    })
});



router.get('/comment', (req, res) => {
    const id = req.query._id;
    console.log('COMMENTS', id);
    Comments.find({ answerID: id }).exec().then(docs => {
        console.log.bind('COMMENTS', docs);
        if (docs.length > 0) {
            fs.appendFile('logs.txt', 'Status 200 - GET/comment, All Comments Returned  '+Date.now()+'\n', function (err) {
                if (err) throw err;
                console.log('Updated!');
              });
            res.status(200).json(docs);
        }
        else {
            fs.appendFile('logs.txt', 'Status 200 - GET/comment, No Comments for this answer  '+Date.now()+'\n', function (err) {
                if (err) throw err;
                console.log('Updated!');
              });
            res.status(200).json({ message: "No Comments for this answer" })
        }
    }).catch(err => {
        fs.appendFile('logs.txt', 'Status 200 - GET/comment, Error  '+Date.now()+'\n', function (err) {
            if (err) throw err;
            console.log('Updated!');
          });
        res.status(204).json({
            err: err
        })
    });
});


//to get a particular answer posted by that user
router.get('/useranswer', (req, res) => {
    Answers.find({ owner: req.query.email }).exec().then(result => {
        if (result.length > 0) {
            fs.appendFile('logs.txt', 'Status 200 - GET/useranswer, User Answer Returned  '+req.query.email+'  '+Date.now()+'\n', function (err) {
                if (err) throw err;
                console.log('Updated!');
              });
            res.status(200).json(result);
        }
        else {
            fs.appendFile('logs.txt', 'Status 204 - GET/useranswer, No Answers Found  '+req.query.email+'  '+Date.now()+'\n', function (err) {
                if (err) throw err;
                console.log('Updated!');
              });
            res.status(204).json({
                message: "No Answers found"
            });
        }
    }).catch(err => {
        console.log(err);
        fs.appendFile('logs.txt', 'Status 200 - GET/useranswer, Error  '+req.query.email+'  '+Date.now()+'\n', function (err) {
            if (err) throw err;
            console.log('Updated!');
          });
        res.status(204).json({
            message: "Error"
        });
    });
});


//to get question that user answered
router.get('/question', (req, res) => {
    Questions.find({ _id: req.query._id }).exec().then(docs => {
        if (docs.length > 0) {
            console.log('MY QUESTION ', docs);
            fs.appendFile('logs.txt', 'Status 200 - GET/question, Question Returned  '+Date.now()+'\n', function (err) {
                if (err) throw err;
                console.log('Updated!');
              });
            res.status(200).json(docs);
        }
        else {
            fs.appendFile('logs.txt', 'Status 200 - GET/question, No Questions Found  '+Date.now()+'\n', function (err) {
                if (err) throw err;
                console.log('Updated!');
              });
            res.status(204).json({
                message: "No Questions Found"
            })
        }
    }).catch(err => {
        console.log(err);
        fs.appendFile('logs.txt', 'Status 200 - GET/question, Error  '+Date.now()+'\n', function (err) {
            if (err) throw err;
            console.log('Updated!');
          });
        res.status(204).json({
            message: "Error"
        });
    })
});


router.post('/bookmark', (req, res) => {
    var answerID = req.body._id;
    var questionID = req.body.questionID;
    var answer = req.body.answer;
    var email = req.body.email;
    var question = req.body.question;
    var questionOwner = req.body.questionOwner;
    Bookmarks.find({ answerID: answerID, owner: email }).then(result => {
        if (result.length > 0) {
            fs.appendFile('logs.txt', 'Status 200 - POST/bookmark, Removed from Bookmarks  '+req.body.email+'  '+Date.now()+'\n', function (err) {
                if (err) throw err;
                console.log('Updated!');
              });
            Bookmarks.remove({ answerID: answerID, owner: email }).then(resultBook => {
                res.status(200).json({
                    bookmarked: false
                });
            });
        }
        else {
            const bookmark = new Bookmarks({
                _id: new mongoose.Types.ObjectId(),
                questionID: questionID,
                answerID: answerID,
                owner: email,
                answer: answer,
                question: question,
                questionOwner: questionOwner
            });

            bookmark.save().then(result => {
                console.log(result);
                fs.appendFile('logs.txt', 'Status 200 - POST/bookmark, Bookmark saved  '+req.body.email+'  '+Date.now()+'\n', function (err) {
                    if (err) throw err;
                    console.log('Updated!');
                  });
                res.status(200).json({
                    bookmarked: true
                })
            });
        }
    })
})

router.get('/bookmark', (req, res) => {
    var email = req.query.email;
    Bookmarks.find({ owner: email }).then(result => {
        if (result.length > 0) {
            fs.appendFile('logs.txt', 'Status 200 - GET/bookmark, All Bookmarks returned  '+req.query.email+'  '+Date.now()+'\n', function (err) {
                if (err) throw err;
                console.log('Updated!');
              });
            res.status(200).json(result);
        }
        else {
            fs.appendFile('logs.txt', 'Status 200 - GET/bookmark, No Bookmarked answers found  '+req.query.email+'  '+Date.now()+'\n', function (err) {
                if (err) throw err;
                console.log('Updated!');
              });
            res.status(200).json({
                message: "No Bookmarked answers found"
            })
        }
    })
})

router.post('/views', (req, res) => {
    var questionID = req.body.questionID;
    Answers.update({ questionID: questionID }, { $inc: { views: 1 } }, { multi: true }).then(resultA => {
        console.log(resultA);
        Questions.update({ _id: questionID }, { $inc: { views: 1 } }, { multi: true }).then(resultQ => {
            console.log(resultQ);
            fs.appendFile('logs.txt', 'Status 200 - POST/views, View Incremented  '+Date.now()+'\n', function (err) {
                if (err) throw err;
                console.log('Updated!');
              });
            res.status(200).json({
                message: 'You view this answer'
            })
        })
    });

})


//get answers by user
router.get('/answered', (req, res) => {
    var owner = req.query.owner;
    var query = { owner: owner };
    var sort = req.query.sort == null || req.query.sort == "" ? -1 : req.query.sort; //for your content
    var yearFilter = req.query.year == null || req.query.year == "" ? "" : req.query.year;//for your content

    Answers.find(query)
        .sort({ posted: sort })
        .exec()
        .then(docs => {

            if (yearFilter != "") {

                var original_docs = docs;
                docs = [];
                for (var i in original_docs) {
                    if (yearFilter == original_docs[i].posted.getFullYear()) { docs.push(original_docs[i]); }
                }

            }
            fs.appendFile('logs.txt', 'Status 200 - POST/answered, Returning Sorted  '+Date.now()+'\n', function (err) {
                if (err) throw err;
                console.log('Updated!');
              });
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })

});


router.get('/notify', (req, res) => {
    var email = req.query.email;
    Notifications.find({ follower: email, seen: false, view: true }).exec().then(result => {
        fs.appendFile('logs.txt', 'Status 200 - GET/notify, Return Notifications  '+email+'  '+Date.now()+'\n', function (err) {
            if (err) throw err;
            console.log('Updated!');
          });
        res.status(200).json(result);

    })
})

router.get('/notifycount', (req, res) => {
    var email = req.query.email;
    Notifications.find({ follower: email, seen: false, view: true }).count()
        .exec().then(result => {
        fs.appendFile('logs.txt', 'Status 200 - POST/notifycount, user:'+email+',  Return Notifications  '+Date.now()+'\n', function (err) {
            if (err) throw err;
            console.log('Updated!');
          });
        res.status(200).json(result);

    })
})


router.post('/notify', (req, res) => {
    var email = req.body.email;
    Notifications.update({ follower: email, view: true }, {$set: {seen: true}}, {multi: true}).exec().then(result => {
        console.log(result);
        fs.appendFile('logs.txt', 'Status 200 - POST/notify, Removed from notification  '+email+'  '+Date.now()+'\n', function (err) {
            if (err) throw err;
            console.log('Updated!');
          });
        res.status(200).json({
            message: "Removed from notification"
        });

    })
})

module.exports = router;