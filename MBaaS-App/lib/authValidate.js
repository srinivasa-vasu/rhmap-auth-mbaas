/**
 * Created by srinivasavasu on 18/04/17.
 */

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var jwt = require('jsonwebtoken');
var config = require('./config');


function validateRoute() {
    var validate = new express.Router();
    validate.use(cors());
    validate.use(bodyParser());


    validate.post('/', function (req, res) {
        console.log("Validate token>>>");
        var token = req.body.token;
        // decode token & verify secret
        jwt.verify(token, config.secret, function (err, decoded) {
            console.log(err, decoded);
            if (err) {
                // If there is an error return 403
                return res.status(403).send({
                    success: false,
                    message: 'Invalid token provided.'
                });

            }
            // Return success
            return res.json({
                status: 'ok',
                decoded: decoded
            });
        });

    });

    return validate;
}

module.exports = validateRoute;

