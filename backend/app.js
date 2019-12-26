const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var cors = require('cors');
const userRoutes = require('./api/routes/user');
const profileRoutes = require('./api/routes/profile');
const searchRoutes = require('./api/routes/search');
const questionRoutes = require('./api/routes/question');
const answerRoutes = require('./api/routes/answers');
const messageRoutes = require('./api/routes/messages');
const topicRoutes = require('./api/routes/topic');
const graphRoutes = require('./api/routes/graph');

var passport = require("passport");
var passportJWT = require("passport-jwt");

require('./api/auth/auth');

mongoose.connect('mongodb+srv://root:' +
process.env.MONGO_PASSWORD+ 
'@cluster0-kgps1.mongodb.net/quora?retryWrites=true',
{
    useNewUrlParser: true
}
);
mongoose.set('useCreateIndex', true)
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
//use cors to allow cross origin resource sharing
//app.use(cors({ origin: 'http://ec2-13-56-140-36.us-west-1.compute.amazonaws.com:3000', credentials: true }));
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(passport.initialize());

var passport = require("passport");

app.post("/secret", passport.authenticate('jwt', { session : false }), function(req, res){

    console.log("success",req.body);
    
    res.json({'message': "Success","success":req.body.email});
  });


app.use('/user', userRoutes);
app.use('/profile', profileRoutes);
//app.use('/profile', passport.authenticate('jwt', { session : false }), profileRoutes);
app.use('/search', searchRoutes);
app.use('/questions', questionRoutes);
app.use('/answers', answerRoutes);
app.use('/messages', messageRoutes);
app.use('/topics', topicRoutes);
app.use('/graph', graphRoutes);

app.use((req, res, next) => {
    const error = new Error('Api not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
});

module.exports = app;