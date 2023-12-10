"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logMsg = void 0;
//https://www.youtube.com/watch?v=2kKeQl_m8iY&ab_channel=RichardOliverBray
var pino_1 = require("pino");
/*
const transportConfig = {
    transport: {
        target: "pino-pretty",
        options: {
            translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
            ignore: "pid,hostname",
        },
    },
}
*/
var transport = pino_1.default.transport({
    targets: [{
            level: 'trace',
            target: 'pino/file',
            options: {
                destination: './logs.log',
            }
        }]
});
var logger = (0, pino_1.default)(transport);
function logMsg(msg, option) {
    if (option == "info" || option === undefined) {
        logger.info(msg);
    }
    else if (option == "error") {
        logger.error(msg);
    }
    else if (option == "fatal") {
        logger.fatal(msg);
    }
}
exports.logMsg = logMsg;
