const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
const Profile = require('../models/profile');
var kafka = require('../kafka/client');
const fs = require('fs');

router.get('/kafkaloadbalancer', (req, res, next)=>{
    kafka.make_request("quora", req, function(err, result){
        if(err){
            console.log("Error in adding question.", err);
        }
        if (result){
            console.log("from Kafka",result);
            res.status(200).json(result);
        }
        else {
            res.status(404).json({message:"not a valid Profile"});
        }
    });
        
});



router.get('/loadbalancer', (req, res, next) => {
    
            res.status(200).json({loadbalancer:"Tested"});
            console.log("load balancer tested successfully");
        

});
router.get('/', (req, res, next) => {
    User.find()
        .exec()
        .then(docs => {
            console.log(docs);
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })

});

router.post('/google', (req, res, next) => {
    Profile.findOne({ email: req.body.email })
        .exec()
        .then(docs => {
            if (!docs) {
                const profile = new Profile({
                    _id: new mongoose.Types.ObjectId(),
                    email: req.body.email,
                    fname: req.body.fname,
                    lname: req.body.lname,
                    image: req.body.image,
                    about: "",
                    city: "",
                    country: "",
                    companyname: "",
                    companyposition: "",
                    companystart: "",
                    companyend: "",
                    profilecredential: "",
                    educationschool: "",
                    educationstart: "",
                    educationend: "",
                    educationdegree: "",
                    state:"",
                    zipcode:"",
                    company:[],
                    education:[],
                });
                profile
                    .save()
                    .then(result => {
                        res.cookie('cookie', 'cookie', { maxAge: 900000, httpOnly: false, path: '/' });

                        const body = { user: req.body.email };
                        const token = jwt.sign({ user: body }, 'password');
                        res.status(200).json({

                            email: req.body.email,
                            fname: req.body.fname,
                            lname: req.body.lname,
                            image: req.body.image,
                            jwt: 'Bearer ' + token,
                        });
                    })

                    .catch(err => {
                        console.log(err);
                        res.status(202).json({
                            message: err
                        })
                    })
            }
            else {
                res.cookie('cookie', 'cookie', { maxAge: 900000, httpOnly: false, path: '/' });

                const body = { user: req.body.email };
                const token = jwt.sign({ user: body }, 'password');
                res.status(200).json({

                    email: req.body.email,
                    fname: req.body.fname,
                    lname: req.body.lname,
                    image: req.body.image,
                    jwt: 'Bearer ' + token,
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(202).json({
                message: err
            })
        })


});


router.post('/', (req, res, next) => {
    var cipher = crypto.createCipher('aes-256-ecb', 'password');
    var mystr = cipher.update(req.body.password, 'utf8', 'hex') + cipher.final('hex');
    User.findOne({ email: req.body.email })
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({ message: "User Already Exists" });
            }
            else {
                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    email: req.body.email,
                    fname: req.body.fname,
                    lname: req.body.lname,
                    password: mystr,

                });
                user
                    .save()
                    .then(result => {
                        console.log(result);

                        Profile.findOne({ email: req.body.email })
                            .exec()
                            .then(docs => {
                                if (!docs) {
                                    const profile = new Profile({
                                        _id: new mongoose.Types.ObjectId(),
                                        email: req.body.email,
                                        fname: req.body.fname,
                                        lname: req.body.lname,
                                        image: "http://localhost:3000/uploads/dummy.png",
                                        about: "",
                                        city: "",
                                        country: "",
                                        companyname: "",
                                        companyposition: "",
                                        companystart: "",
                                        companyend: "",
                                        profilecredential: "",
                                        educationschool: "",
                                        educationstart: "",
                                        educationend: "",
                                        educationdegree: "",
                                        state:"",
                                        zipcode:"",
                                        company:[],
                                        education:[],
                                        

                                    });
                                    profile
                                        .save()
                                        .then(result1 => {
                                            console.log(result1);
                                            res.status(200).json({ message: "User Created Successfully" });
                                        })

                                        .catch(err => console.log(err));

                                }
                                else {
                                    res.status(200).json({ message: "User Created Successfully" });

                                }
                            });



                    });

            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        })


});


router.get('/search/:search', (req, res, next) => {
    const search= req.params.search;
    Profile.find( { 'fname' : { '$regex' : search, '$options' : 'i' } } )
    .exec()
        .then(doc => {
            res.status(200).json(doc);
        })

});


router.get('/:userId', (req, res, next) => {
    const email = req.params.userId;
    User.findOne({ email: email })
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
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

router.post('/login', (req, res, next) => {
    console.log("req.body", req.body)
    var cipher = crypto.createCipher('aes-256-ecb', 'password');
    var mystr = cipher.update(req.body.password, 'utf8', 'hex') + cipher.final('hex');

    User.findOne({ email: req.body.email })
        .exec()
        .then(doc => {
            if (doc) {
                console.log("From database", doc);
                Profile.findOne({ email: req.body.email })
                    .exec()
                    .then(result => {
                        if (doc.password === mystr && doc.role === req.body.role) {

                            res.cookie('cookie', 'cookie', { maxAge: 900000, httpOnly: false, path: '/' });

                            const body = { user: doc.email };
                            const token = jwt.sign({ user: body }, 'password');
                            res.status(200).json({
                                image: result.image,
                                email: doc.email,
                                fname: doc.fname,
                                lname: doc.lname,
                                jwt: 'Bearer ' + token,
                            });
                        }
                        else {
                            res.status(202).json({ message: "Invalid Credentials" });
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({ error: err });
                    })





            }
            else {
                res.status(202).json({ message: "Invalid User" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        })

});
/* Create 10000 user route */
router.post('/all', (req, res, next) => {
    
    console.log("req.body",req.body);
    for (const body of req.body){
    User.findOne({ email: body.email })
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json({ message: "User Already Exists" });
            }
            else {
                var cipher = crypto.createCipher('aes-256-ecb', 'password');
    var mystr = cipher.update(body.password, 'utf8', 'hex') + cipher.final('hex');
                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    email: body.email,
                    fname: body.fname,
                    lname: body.lname,
                    password: mystr,

                });
                user
                    .save()
                    .then(result => {
                        console.log(result);

                        Profile.findOne({ email: body.email })
                            .exec()
                            .then(docs => {
                                if (!docs) {
                                    const profile = new Profile({
                                        _id: new mongoose.Types.ObjectId(),
                                        email: body.email,
                                        fname: body.fname,
                                        lname: body.lname,
                                        image: "http://localhost:3000/uploads/dummy.png",
                                        about: "",
                                        city: "",
                                        country: "",
                                        companyname: "",
                                        companyposition: "",
                                        companystart: "",
                                        companyend: "",
                                        profilecredential: "",
                                        educationschool: "",
                                        educationstart: "",
                                        educationend: "",
                                        educationdegree: "",
                                        state:"",
                                        zipcode:"",
                                        company:[],
                                        education:[],
                                        

                                    });
                                    profile
                                        .save()
                                        .then(result1 => {
                                            console.log(result1);
                                            res.status(200).json({ message: "User Created Successfully" });
                                        })

                                        .catch(err => console.log(err));

                                }
                                else {
                                    res.status(200).json({ message: "User Created Successfully" });

                                }
                            });



                    });

            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        })
    }
});

router.post('/delete', (req, res, next) => {
    console.log("req.body", req.body.params.email)
    User.deleteOne({ email: req.body.params.email })
        .exec()
        .then(doc => {
            if (doc) {
                console.log("From database", doc);
                Profile.updateOne({ email: req.body.params.email }, { $set: { active: 0 } })
                    .exec()
                    .then(result => {
                        console.log(result);
                        res.status(200).json({ message: "User Deleted" ,
                        result:result});
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({ error: err });
                    })

            }
            else {
                res.status(202).json({ message: "Invalid User" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        })

});

module.exports = router;