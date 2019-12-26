const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
const Profile = require('../models/profile');
const Question = require('../models/question');
const Topic = require('../models/topic');
const fs = require('fs');

router.get('/profile', (req, res, next) => {
    const search = req.query.search;
    if(search){
        Profile.find({ 'active':1,'fname': { '$regex': search, '$options': 'i' } }).limit(3)
        .exec()
        .then(profile => {
            console.log({ profile: profile });
            fs.appendFile('logs.txt', 'Status 200 - GET/profile, Profile Search Returned  '+Date.now()+'\n', function (err) {
                if (err) throw err;
                console.log('Updated!');
              });
            res.status(200).json({ profile: profile });

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        })
    }
    else{
        res.status(200).json({ profile: []});
    }
   

});

router.get('/user', (req, res, next) => {
    const search = req.query.search;
    if(search){
    User.find({ 'email': { '$regex': search, '$options': 'i' } }).limit(3)
        .exec()
        .then(user => {
            fs.appendFile('logs.txt', 'Status 200 - GET/user, User Search Returned  '+Date.now()+'\n', function (err) {
                if (err) throw err;
                console.log('Updated!');
              });
            res.status(200).json({ user: user });

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        })
    }
    else{
        res.status(200).json({ user: []});
    }

});

router.get('/question', (req, res, next) => {
    const search = req.query.search;
    if(search){
    Question.find({ 'question': { '$regex': search, '$options': 'i' } }).limit(3)
        .exec()
        .then(question => {
            fs.appendFile('logs.txt', 'Status 200 - GET/question, Question Search Returned  '+Date.now()+'\n', function (err) {
                if (err) throw err;
                console.log('Updated!');
              });
            res.status(200).json({ question: question });

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        })
    }
    else{
        res.status(200).json({ question: []});
    }

});

router.get('/topic', (req, res, next) => {
    const search = req.query.search;
    if(search){
        Topic.find({ 'topic': { '$regex': search, '$options': 'i' } }).limit(3)
        .exec()
        .then(topic => {
            fs.appendFile('logs.txt', 'Status 200 - GET/topic, Topic Search Returned  '+Date.now()+'\n', function (err) {
                if (err) throw err;
                console.log('Updated!');
              });
            res.status(200).json({ topic: topic });

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        })
    }
    else{
        res.status(200).json({ topic: []});
    }

});



module.exports = router;