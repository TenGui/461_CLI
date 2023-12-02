'use strict';

import * as path from 'path';
import * as http from 'http';
import * as mysql from 'mysql2';
import * as oas3Tools from 'oas3-tools';
import { Helper } from "./database_files/authorization";

const serverPort: number = 3001;

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
    //     format: 'common',
    //     level: 'info',
    // },
    // swaggerUIts: {},
    // swaggerUI: {}
};


const expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);
const app = expressAppConfig.getApp();

// Initialize the Swagger middleware
http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);

    const helper = new Helper();
    helper.setEnvVariables();
    
});