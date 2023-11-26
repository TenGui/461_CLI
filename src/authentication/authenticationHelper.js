"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPerms = exports.validateToken = exports.createToken = void 0;
var jwt = require("jsonwebtoken");
require('dotenv').config();
var secret = process.env.SECRET;
function createToken(payload) {
    //console.log("Creating Token")
    return jwt.sign(payload, secret, { expiresIn: '10h' });
}
exports.createToken = createToken;
function validateToken(token) {
    var decodedToken;
    try {
        decodedToken = jwt.verify(token, secret);
    }
    catch (err) {
        console.error(err);
        return err;
    }
    return decodedToken;
}
exports.validateToken = validateToken;
//Takes a validated jsonwebtoken and a json with only the required permissions set to true
//ie: if you wanted to require on "canSearch" json = {canSearch: true}
function checkPerms(validatedToken, requiredPerms) {
    for (var key in requiredPerms) {
        if (validatedToken[key] == false)
            return 0;
    }
    return 1;
}
exports.checkPerms = checkPerms;
