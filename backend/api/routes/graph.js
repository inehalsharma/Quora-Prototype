const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Answers = require('../models/answers');
const Comments = require('../models/comments');
const Questions = require('../models/question');
const Bookmarks = require('../models/bookmarks');
var multer = require('multer');
const path = require("path");
const Profile = require('../models/profile');
const ProfileView = require('../models/profileview');

//Graph 10 Answer Fetch with upvote
router.get('/graphupvote', (req, res) => {

    Answers.find({ owner: req.query.email }).sort({ upVote: 'desc', _id: -1 }).limit(10)
        .exec()
        .then(result => {
            if (result.length > 0) {
                res.status(200).json(result);
            }
            else {
                res.status(204).json({
                    message: "No Answers found"
                });
            }
        }).catch(err => {
            console.log(err);
            res.status(204).json({
                message: "Error"
            });
        });
});

//Graph 5 Answer Fetch with Downvotes
router.get('/graphdownvote', (req, res) => {

    Answers.find({ owner: req.query.email }).sort({ downVote: 'desc', _id: -1 }).limit(5)
        .exec()
        .then(result => {
            if (result.length > 0) {
                res.status(200).json(result);
            }
            else {
                res.status(204).json({
                    message: "No Answers found"
                });
            }
        }).catch(err => {
            console.log(err);
            res.status(204).json({
                message: "Error"
            });
        });
});


//Graph top 10 view Answer Fetch
router.get('/graphanswer', (req, res) => {

    Answers.find({ owner: req.query.email }).sort({ views: 'desc', _id: -1 }).limit(10)
        .exec()
        .then(result => {
            if (result.length > 0) {
                res.status(200).json(result);
            }
            else {
                res.status(204).json({
                    message: "No Answers found"
                });
            }
        }).catch(err => {
            console.log(err);
            res.status(204).json({
                message: "Error"
            });
        });
});


//Graph of top 10 number of bookmarked answers
router.get('/graphbookmark', (req, res) => {
    var counts = {};
    var data =[];
    var newdate;
    Bookmarks.find({questionOwner: req.query.email })
        .exec()
        .then(result => {
            if (result.length > 0) {
                result.map(item => {
                   
                    newdate = item.questionID;
                    
                    data.push(newdate)

                })
                
                res.status(200).json({"data":data,"result":result});
            }
            else {
                res.status(204).json({
                    message: "No Answers found"
                });
            }
        }).catch(err => {
            console.log(err);
            res.status(204).json({
                message: "Error"
            });
        });
});




//Graph 10  Question Fetch
router.get('/graphquestion', (req, res) => {

    Questions.find({ owner: req.query.email }).sort({ views: 'desc', _id: -1 }).limit(10)
        .exec()
        .then(result => {
            if (result.length > 0) {
                res.status(200).json(result);
            }
            else {
                res.status(204).json({
                    message: "No Question found"
                });
            }
        }).catch(err => {
            console.log(err);
            res.status(204).json({
                message: "Error"
            });
        });
});

//graph profile view fetch
router.get('/profileview', (req, res) => {

    ProfileView.find({ email: req.query.email })
        .exec()
        .then(result => {
            if (result.length>0) {
                var data =[];
                var newdate;
                result.map(item => {
                    var month = item.date.getUTCMonth() + 1; //months from 1-12
                    var day = item.date.getUTCDate();
                    var year = item.date.getUTCFullYear();
                    newdate = year + "/" + month + "/" + day;
                    
                    data.push(newdate)

                })
               
                res.status(200).json(data);

            }
            else {
                res.status(204).json({
                    message: "No Answers found"
                });
            }
        }).catch(err => {
            console.log(err);
            res.status(204).json({
                message: "Error"
            });
        });
});


module.exports = router;