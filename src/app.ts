'use strict';

import * as path from 'path';
import * as http from 'http';
import * as mysql from 'mysql2';
import * as oas3Tools from 'oas3-tools';
import { Helper } from "./database_files/authorization";

//Logging related imports
import * as fs from 'fs';
import * as morgan from 'morgan';
const uuid = require('uuid');

//setup tokens for formatting string
morgan.token('auth', function (req, res) { ;
    return req.header('X-Authorization')});
morgan.token('resBody', function (req, res) { ;
    //make new json to return
    let tempBody:JSON;
    if(res.body) {
        tempBody = JSON.parse(JSON.stringify(res.body));
        if(res.body.hasOwnProperty("Content")){
            tempBody["Content"] = tempBody["Content"].length;
        }
        if(res.body.hasOwnProperty("PackageData")){
            if(res.hasOwnProperty("PackageData")){
                tempBody["PackageData"]["Content"] = tempBody["PackageData"]["Content"].length;
            }
        }
    }
    else {
        tempBody = res.body;
    }

    return JSON.stringify(tempBody)});  
morgan.token('reqBody', function (req, res) { ;
    //make new json to return
    let tempBody:JSON = JSON.parse(JSON.stringify(req.body));
    if(req.body.hasOwnProperty("Content")){
        tempBody["Content"] = tempBody["Content"].length;
    }
    if(req.body.hasOwnProperty("PackageData")){
        if(req.hasOwnProperty("PackageData")){
            tempBody["PackageData"]["Content"] = tempBody["PackageData"]["Content"].length;
        }
    }
    return JSON.stringify(tempBody)});    
morgan.token('uuid', function (req, res) { ;
    return req.requestId});
//make format strings for logging 
const reqFormat = "REQUEST reqID\::uuid :remote-addr - :remote-user [:date[clf]] \":method :url HTTP/:http-version\" authHeader\: :auth reqBody\: :reqBody";
const resFormat = "RESPONSE reqID\::uuid :remote-addr - :remote-user [:date[clf]] \":method :url HTTP/:http-version\" :status  authHeader\: :auth resBody\: :resBody";
// create a write stream (in append mode) for the logger
var logStream = fs.createWriteStream(path.join(__dirname, 'req.log'), { flags: 'a' });
//setup typedef for uuid field in request so that typescript doesn't throw a fit 
declare global {
    namespace Express {
        interface Request {
            requestId: string;
        }
    }
};

const serverPort: number = 3000;

// swaggerRouter configuration
const options: any =  {
    routing: {
        controllers: path.join(__dirname, './controllers')
    },
    openApiValidator: {
        apiSpec: path.join(__dirname, 'api/openapi.yaml'),
        validateResponses: {
            removeAdditional: true,
        },
        validateRequests: {
            allowUnknownQueryParameters: false
        }, 
        validateSecurity: true,
        validateFormats: 'full',
    },
    // logging: {
    //     format: 'commmon',
    //     level: 'info',
    // },
    // swaggerUIts: {},
    // swaggerUI: {}
};


const expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);
const app = expressAppConfig.getApp();



//create a write stream (in append mode)
let logOptions = {stream: logStream};
let immediateOptions = {
    stream: logStream,
    immediate: true
};
const resLogger = morgan(resFormat, logOptions);
app.use(resLogger);

const reqLogger = morgan(reqFormat, immediateOptions);
app.use(reqLogger);


//hack solution to dump a logger in at the end of the middleware stack
const stack = app._router.stack;
const lastEntries = stack.splice(app._router.stack.length - 2);  // The number of middle ware added
const firstEntries = stack.splice(0, 15); //How many middlewares should come before the new one
app._router.stack = [...firstEntries, ...lastEntries, ...stack];
//console.log(app._router.stack);


function uuidMaker (req, res, next) {
    req.requestId = uuid.v4(); // Attach a unique ID to the request
    //console.log("made id: " + req.requestId);
    next();
};
app.use(uuidMaker);
//dumping the uuid for the logging at the beginning
const stack2 = app._router.stack;
const lastEntries2 = stack2.splice(app._router.stack.length - 1);  // The number of middle ware added
const firstEntries2 = stack2.splice(0, 1); //How many middlewares should come before the new one
app._router.stack = [...firstEntries2, ...lastEntries2, ...stack2];
//console.log(app._router.stack);



// // Initialize the Swagger middleware
http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);

    const helper = new Helper();
    helper.setEnvVariables();
    
});