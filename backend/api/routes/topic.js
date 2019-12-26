const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Topic = require('../models/topic');
var multer = require('multer');
const path = require("path");
const Topicfollower = require('../models/topicfollower');
const fs = require('fs');

router.get('/', (req, res, next) => {
    Topic.find()
        .exec()
        .then(docs => {
            console.log(docs);
            fs.appendFile('logs.txt', 'Status 200 - GET, Topics Returned  '+Date.now()+'\n', function (err) {
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



const storage = multer.diskStorage({
    destination: "../frontend/public/uploads/topic",
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 999999999999999999999999 },
}).single("myImage");

router.post('/', (req, res, next) => {

    upload(req, res, (err) => {
        const param = req.body.param;
        var picName = "";
        if(req.file == null || req.file.originalname == null || req.file.originalname == "")
        {
            picName = "default.jpg"; //if no pic was uploaded display default
        }
        else
        {
            var picName = req.file.originalname;
            var filepath = req.file;   
            var filepath = filepath.filename;
        }
        var data =  { topic: param, picture: picName};
        var query = { topic: param },
            options = { upsert: true, new: true, setDefaultsOnInsert: true };

        //console.log("Request file ---", JSON.stringify(req.file));  //Here you get file.
      
        // //first you wanna check if topic exists, then create else update
        Topic.findOneAndUpdate(query,    {  $set : data}, options, function (error, result) {
                console.log("resiult", error)
           console.log("inside");
           fs.appendFile('logs.txt', 'Status 200 - POST, Topics Created  '+Date.now()+'\n', function (err) {
            if (err) throw err;
            console.log('Updated!');
          });
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end("Topic Created");
        });

    }); //upload end
});




//var object = new Topic({ _id: new mongoose.Types.ObjectId(), topic: param });
// object
//     .save()
//     .then(result => {
//         console.log(result);
//     }).catch(err => console.log(err));

//     res.writeHead(200, {
//         'Content-Type': 'text/plain'
//     });
//     res.end("Topic Created");


//follow a topic
router.post('/follow', (req, res, next) => {
    const param = req.body.topic;
    const follower = req.body.follower;
    var object = new Topicfollower({ _id: new mongoose.Types.ObjectId(), topic: param, follower: follower });
    object
        .save()
        .then(result => {
            console.log(result);
        }).catch(err => console.log(err));
        fs.appendFile('logs.txt', 'Status 200 - POST/follow, Topics Followed  '+follower+'  '+Date.now()+'\n', function (err) {
            if (err) throw err;
            console.log('Updated!');
          });
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end("Topic followed");
    });

//check if a topic is followed
    
    router.get('/isfollowed', (req, res, next) => {
        var topic = req.query.topic;
        var follower = req.query.follower;
        Topicfollower.find({topic:topic, follower: follower})
        .exec()
        .then(docs => {
    
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
        });

module.exports = router;