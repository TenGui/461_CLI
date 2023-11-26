import * as jwt from "jsonwebtoken";
require('dotenv').config();

let secret = process.env.SECRET;

export function createToken(payload){
    //console.log("Creating Token")
    return jwt.sign(payload, secret, { expiresIn: '10h' });
}

export function validateToken(token: string){
    let decodedToken: any;
    try {
        decodedToken = jwt.verify(token, secret);
    } 
    catch(err) {
        console.error(err);
        return err;
    }
    return decodedToken;
}
//Takes a validated jsonwebtoken and a json with only the required permissions set to true
//ie: if you wanted to require on "canSearch" json = {canSearch: true}
export function checkPerms(validatedToken, requiredPerms) {
    for (let key in requiredPerms){
        if(validatedToken[key] == false)
            return 0;
    }
        return 1;
}

