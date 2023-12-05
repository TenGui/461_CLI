"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = exports.createToken = void 0;
var jwt = require("jsonwebtoken");
var secret = "mysecret";
var AuthEnable = process.env.AUTH_ENABLE;
if (secret == null) {
    throw "The \"SECRET\" parameter for JWTs was not found in the env file";
}
if (AuthEnable == null) {
    throw "The \"AUTH_ENABLE\" parameter is not set in the .env file";
}
function createToken(payload) {
    //console.log("Creating Token")
    return jwt.sign(payload, secret, { expiresIn: '10h' });
}
exports.createToken = createToken;
function validateToken(token) {
    if (AuthEnable != '1') {
        return { "success": 1, "token": {
                user: 'authBypass',
                pass: 'authBypass',
                isAdmin: 1,
                canSearch: 1,
                canUpload: 1,
                canDownload: 1
            } };
    }
    var unbearered = token.split(" ")[1];
    //console.log("with bearer: "+ token +"\n without bearer: "+ unbearered);
    var decodedToken;
    try {
        decodedToken = jwt.verify(unbearered, secret);
    }
    catch (err) {
        //console.error(err);
        return { "success": -1, "token": null };
    }
    return { "success": 1, "token": decodedToken };
}
exports.validateToken = validateToken;
