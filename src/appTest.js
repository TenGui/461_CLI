'use strict';
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var http = require("http");
var oas3Tools = require("oas3-tools");
var authorization_1 = require("./database_files/authorization");
//Logging related imports
var fs = require("fs");
var morgan = require("morgan");
var uuid = require('uuid');
//setup tokens for formatting string
morgan.token('auth', function (req, res) {
    ;
    return req.header('X-Authorization');
});
morgan.token('resBody', function (req, res) {
    ;
    //make new json to return
    var tempBody;
    if (res.body) {
        tempBody = JSON.parse(JSON.stringify(res.body));
        if (res.body.hasOwnProperty("Content")) {
            tempBody["Content"] = tempBody["Content"].length;
        }
        if (res.body.hasOwnProperty("PackageData")) {
            if (res.hasOwnProperty("PackageData")) {
                tempBody["PackageData"]["Content"] = tempBody["PackageData"]["Content"].length;
            }
        }
    }
    else {
        tempBody = res.body;
    }
    return JSON.stringify(tempBody);
});
morgan.token('reqBody', function (req, res) {
    ;
    //make new json to return
    var tempBody = JSON.parse(JSON.stringify(req.body));
    if (req.body.hasOwnProperty("Content")) {
        tempBody["Content"] = tempBody["Content"].length;
    }
    if (req.body.hasOwnProperty("PackageData")) {
        if (req.hasOwnProperty("PackageData")) {
            tempBody["PackageData"]["Content"] = tempBody["PackageData"]["Content"].length;
        }
    }
    return JSON.stringify(tempBody);
});
morgan.token('uuid', function (req, res) {
    ;
    return req.requestId;
});
//make format strings for logging 
var reqFormat = "\nREQUEST reqID\::uuid :remote-addr - :remote-user [:date[clf]] \":method :url HTTP/:http-version\" authHeader\: :auth reqBody\: :reqBody";
var resFormat = "\nRESPONSE reqID\::uuid :remote-addr - :remote-user [:date[clf]] \":method :url HTTP/:http-version\" :status  authHeader\: :auth resBody\: :resBody";
// create a write stream (in append mode) for the logger
var logStream = fs.createWriteStream(path.join(__dirname, 'req.log'), { flags: 'a' });
;
var serverPort = 3001;
// swaggerRouter configuration
var options = {
    routing: {
        controllers: path.join(__dirname, './controllers')
    },
    openApiValidator: {
        apiSpec: path.join(__dirname, 'api/openapi.yaml'),
        // validateResponses: {
        //     removeAdditional: true,
        // },
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
var expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);
var app = expressAppConfig.getApp();
//create a write stream (in append mode)
var logOptions = { stream: logStream };
var immediateOptions = {
    stream: logStream,
    immediate: true
};
var resLogger = morgan(resFormat, logOptions);
app.use(resLogger);
var reqLogger = morgan(reqFormat, immediateOptions);
app.use(reqLogger);
//hack solution to dump a logger in at the end of the middleware stack
var stack = app._router.stack;
var lastEntries = stack.splice(app._router.stack.length - 2); // The number of middle ware added
var firstEntries = stack.splice(0, 15); //How many middlewares should come before the new one
app._router.stack = __spreadArray(__spreadArray(__spreadArray([], firstEntries, true), lastEntries, true), stack, true);
//console.log(app._router.stack);
function uuidMaker(req, res, next) {
    req.requestId = uuid.v4(); // Attach a unique ID to the request
    //console.log("made id: " + req.requestId);
    next();
}
;
app.use(uuidMaker);
//dumping the uuid for the logging at the beginning
var stack2 = app._router.stack;
var lastEntries2 = stack2.splice(app._router.stack.length - 1); // The number of middle ware added
var firstEntries2 = stack2.splice(0, 1); //How many middlewares should come before the new one
app._router.stack = __spreadArray(__spreadArray(__spreadArray([], firstEntries2, true), lastEntries2, true), stack2, true);
//console.log(app._router.stack);
// // Initialize the Swagger middleware
http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
    var helper = new authorization_1.Helper();
    helper.setEnvVariables();
});
