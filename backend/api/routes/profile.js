const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Profile = require('../models/profile');
var multer = require('multer');
const path = require("path");
const ProfileView = require('../models/profileview');
const Userfollow = require('../models/userfollow');
const fs = require('fs');

router.get('/', (req, res, next) => {
    Profile.find()
        .exec()
        .then(docs => {
            console.log(docs);
            fs.appendFile('logs.txt', 'Status 200 - GET, Return Profile  '+Date.now()+'\n', function (err) {
                if (err) throw err;
                console.log('Updated!');
              });
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            fs.appendFile('logs.txt', 'Status 500 - GET, Error Returning Profile  '+Date.now()+'\n', function (err) {
                if (err) throw err;
                console.log('Updated!');
              });
            res.status(500).json({
                error: err
            })
        })

});

router.get('/email', (req, res, next) => {
    const email = req.query.email;
    Profile.findOne({ email: email })
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                fs.appendFile('logs.txt', 'Status 200 - GET/email, Returning Profle on basis of email  '+email+'  '+Date.now()+'\n', function (err) {
                    if (err) throw err;
                    console.log('Updated!');
                  });
                res.status(200).json(doc);
            }
            else {
                fs.appendFile('logs.txt', 'Status 404 - GET/email, not a valid Email ID  '+email+'  '+Date.now()+'\n', function (err) {
                    if (err) throw err;
                    console.log('Updated!');
                  });
                res.status(404).json({ message: "not a valid Email ID" });
            }

        })
        .catch(err => {
            console.log(err);
            fs.appendFile('logs.txt', 'Status 500 - GET/email, Error  '+email+'  '+Date.now()+'\n', function (err) {
                if (err) throw err;
                console.log('Updated!');
              });
            res.status(500).json({ error: err });
        })

});


router.get('/id', (req, res, next) => {
    const id = req.query.id;
    Profile.findOne({ _id: id })
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                var view = doc.views;
                var email = doc.email;
                view = view + 1;
                Profile.update({ _id: id }, { $set: { views: view } })
                    .exec()
                    .then(result => {
                        console.log(result);
                        
                    })
                    .catch(err => {
                        console.log(err);

                    });

                const profileview = new ProfileView({
                    _id: new mongoose.Types.ObjectId(),
                    email: email,
                });
                profileview
                    .save()
                    .then(result => {
                        console.log(result);
                    })
                    .catch(err => {
                        console.log(err);
                    })
                res.status(200).json(doc);
            }
            else {
                res.status(404).json({ message: "not a valid ID" });
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        })

});

router.patch("/", (req, res, next) => {



    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    const email = updateOps.email;
    console.log("updateOps", updateOps);
    console.log("email", email);
    Profile.update({ email: email }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "Update Was Successful"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
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


router.post('/imgupload', (req, res, next) => {
    upload(req, res, (err) => {

        console.log("Request ---", req.body);
        console.log("Request file ---", JSON.stringify(req.file));  //Here you get file.
        var filepath = req.file;
        var filepath = "http://localhost:3000/uploads/" + filepath.filename;
        var email = req.body.email;

        Profile.update({ email: email }, { $set: { image: filepath } })
            .exec()
            .then(result => {
                console.log(result);
                res.status(200).json({
                    message: filepath
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    });

});

router.get('/education', (req, res, next) => {
    const email = req.query.email;
    Profile.findOne({ email: email }, { "education": 1, "company": 1 })
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json(doc);
            }
            else {
                res.status(404).json({ message: "not a valid Email ID" });
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        })

});

router.post('/follow', (req, res) => {

    Profile.findOne({ email: req.body.follower })
        .exec()
        .then(docs => {

            Userfollow.find({ userid: req.body.userid, followeremail: req.body.follower }).then(result => {

                if ((result.length === 0)) {
                    {
                        const entry = new Userfollow({
                            _id: new mongoose.Types.ObjectId(),
                            userid: req.body.userid,
                            followeremail: req.body.follower,
                            userfname: req.body.userfname,
                            userlname: req.body.userlname,
                            userimage: req.body.userimage,
                            followerfname: docs.fname,
                            followerlname: docs.lname,
                            followerimage: docs.image,
                            followerid: docs._id
                        })

                        entry.save()
                            .then(docs => {
                                console.log("Details of Follower Insertion", docs);
                                res.status(200).json({
                                    success: true,
                                    message: "Sucessfully Followed"
                                })
                            })
                            .catch(err => {
                                console.log(err)
                                res.status(204).json({
                                    message: "Error in Follower Insert"
                                })
                            })
                    }
                }
                else {
                    res.status(200).json({
                        message: "You cannot follow more than once"
                    })
                }

            })

        })
        .catch(err => {
            console.log(err)
            res.status(204).json({
                message: "Error in Follower Insert"
            })
        })
})

router.get('/followNumber', (req, res) => {
    var userid = req.query.userid;
    var query = { userid: userid };
    console.log("Your UserID is ", userid);
    Userfollow.find(query)
        .exec()
        .then(docs => {
            console.log("Follow Number", docs);
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});

router.get('/followercount', (req, res) => {
    var email = req.query.useremail;
    console.log("email", email);
    Profile.findOne({ email: email })
        .exec()
        .then(docs => {
            console.log("docs", docs);
            var query = { userid: docs._id };
            console.log("Your UserID is ", docs._id);
            Userfollow.find(query)
                .exec()
                .then(docs => {
                    console.log("Follow Number", docs);
                    res.status(200).json(docs);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    })
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});

router.get('/following', (req, res) => {
    var email = req.query.followeremail;

    Userfollow.find({followeremail:email})
        .exec()
        .then(docs => {
            console.log("Following data", docs);
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});






module.exports = router;