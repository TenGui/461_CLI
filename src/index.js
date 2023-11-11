'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = exports.promisePool = void 0;
var path = require("path");
var http = require("http");
var mysql = require("mysql2");
var oas3Tools = require("oas3-tools");
var authorization_1 = require("./database_files/authorization");
var serverPort = 3000;
// swaggerRouter configuration
var options = {
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
    //     format: 'common',
    //     level: 'info',
    // },
    // swaggerUIts: {},
    // swaggerUI: {}
};
var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mydb',
    connectionLimit: 5, // Adjust as needed
});
exports.pool = pool;
var promisePool = pool.promise();
exports.promisePool = promisePool;
var expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);
var app = expressAppConfig.getApp();
// Initialize the Swagger middleware
http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
    var helper = new authorization_1.Helper();
    helper.setEnvVariables();
});
