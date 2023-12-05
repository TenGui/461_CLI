import { error } from "console";
import * as jwt from "jsonwebtoken";

let secret = "mysecret";
let AuthEnable = "1";

if(secret == null) {
    throw "The \"SECRET\" parameter for JWTs was not found in the env file"
}
if(AuthEnable == null) {
    throw "The \"AUTH_ENABLE\" parameter is not set in the .env file"
}

export function createToken(payload){
    //console.log("Creating Token")
    return jwt.sign(payload, secret, { expiresIn: '10h' });
}

export function validateToken(token){
    if(AuthEnable != '1'){
        return {"success":1, "token": { 
            user: 'authBypass', 
            pass: 'authBypass',
            isAdmin: 1, 
            canSearch: 1,
            canUpload: 1,
            canDownload: 1
          }};
    }
    let unbearered = token.split(" ")[1];
    //console.log("with bearer: "+ token +"\n without bearer: "+ unbearered);
    
    let decodedToken: any;
    try {
        decodedToken = jwt.verify(unbearered, secret);
    } 
    catch(err) {
        //console.error(err);
        return {"success":-1, "token": null};
    }
    return {"success":1, "token": decodedToken};
}

