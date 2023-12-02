import * as jwt from "jsonwebtoken";
require('dotenv').config();

let secret = process.env.SECRET;

export function createToken(payload){
    //console.log("Creating Token")
    return jwt.sign(payload, secret, { expiresIn: '10h' });
}

export function validateToken(token){
    let decodedToken: any;
    try {
        decodedToken = jwt.verify(token, secret);
    } 
    catch(err) {
        //console.error(err);
        return {"success":-1, "token": null};
    }
    return {"success":1, "token": decodedToken};
}

