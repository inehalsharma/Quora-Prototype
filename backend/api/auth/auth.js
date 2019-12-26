var jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
var passport = require("passport");
var passportJWT = require("passport-jwt");

const JWTstrategy = require('passport-jwt').Strategy;
//We use this to extract the JWT sent by the user
const ExtractJWT = require('passport-jwt').ExtractJwt;

//This verifies that the token sent by the user is valid
passport.use(new JWTstrategy({
  //secret we used to sign our JWT
  secretOrKey : 'password',
  //we expect the user to send the token as a query paramater with the name 'secret_token'
  // jwtFromRequest : ExtractJWT.fromUrlQueryParameter('secret_token')
  jwtFromRequest : ExtractJWT.fromAuthHeaderAsBearerToken()
}, async (token, done) => {
  try {
    //Pass the user details to the next middleware
    console.log("JWT Authentication Done")
    return done(null, token.user);
  } catch (error) {
    done(error);
  }
}));