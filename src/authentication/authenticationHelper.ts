import { error } from "console";
import * as jwt from "jsonwebtoken";

let secret = process.env.SECRET;
let AuthEnable = process.env.AUTH_ENABLE;

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

export function validateToken(token: string){
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
    token = token.substring(1,token.length-1);
    let unbearered = token.split(" ")[1];
    //console.log("with bearer: "+ token +"\n without bearer: "+ unbearered);
    
    let decodedToken: any;
    try {
        decodedToken = jwt.verify(unbearered, secret);
    } 
    catch(err) {
        return {"success":-1, "token": null};
    }
    return {"success":1, "token": decodedToken};
}
export function getAuthEnable(){
    return AuthEnable
}

