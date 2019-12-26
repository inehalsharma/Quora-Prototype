const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


function handle_request(message, callback) {


                
    callback(null, { loadbalancer:"Tested" });

   
}

exports.handle_request = handle_request;