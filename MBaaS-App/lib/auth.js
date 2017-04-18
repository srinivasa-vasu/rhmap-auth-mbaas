/**
 * Created by srinivasavasu on 18/04/17.
 */

var fh = require('fh-mbaas-api');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var jwt = require('jsonwebtoken');
var config = require('./config');

function authRoute() {
    var auth = new express.Router();
    auth.use(cors());
    auth.use(bodyParser());

    auth.post('/', function(req, res) {
        var username = req.body.username || req.body.userId; //native sdks send in userId
        var password = req.body.password;
        console.log("Validate creds>>>");

        //Must pass a username & password
        if (!username || !password) {
            return res.status(500).json({
                'status': 'error',
                'message': 'You need to provide a username and password.'
            });
        }

        var handler = function(err, msg) {
            //Return unauthorised for error response
            if (err) {
                return res.status(401).json({
                    'status': 'unauthorised',
                    'message': 'unauthorised'
                });
            }

            // Found a valid user
            // Create token
            var token = jwt.sign({
                user: username
            }, config.secret, {
                expiresIn: '1h' // Expire token in 1 hour
            });

            // Return a success payload that contains a token
            // This token needs to be sent from the app for every request
            return res.json({
                'status': 'ok',
                'message': 'Successfully Authenticated' + msg,
                'token': token
            });
        };

        //Check the DB if user exists
        searchDB(username, password, handler);
    });

    return auth;
}

//Function to search $fh.db (Mongo) to check if a user exists
function searchDB(user, pass, cb) {
    var options = {
        "act": "list",
        "type": "Users",
        "eq": {
            "username": user,
            "password": pass
        }
    };
    fh.db(options, function(err, data) {
        if (data.count > 0) {
            return cb(null, 'found');
        }
        return cb('notFound', null);
    });

}

module.exports = authRoute;
