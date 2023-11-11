"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeJson = exports.respondWithCode = void 0;
var ResponsePayload = /** @class */ (function () {
    function ResponsePayload(code, payload) {
        this.code = code;
        this.payload = payload;
    }
    return ResponsePayload;
}());
function respondWithCode(code, payload) {
    return new ResponsePayload(code, payload);
}
exports.respondWithCode = respondWithCode;
function writeJson(response, arg1, arg2) {
    var code;
    var payload;
    if (arg1 instanceof ResponsePayload) {
        writeJson(response, arg1.payload, arg1.code);
        return;
    }
    if (Number.isInteger(arg2)) {
        code = arg2;
    }
    else if (Number.isInteger(arg1)) {
        code = arg1;
    }
    if (code && arg1) {
        payload = arg1;
    }
    else if (arg1) {
        payload = arg1;
    }
    if (!code) {
        // if no response code given, we default to 200
        code = 200;
    }
    if (typeof payload === 'object') {
        payload = JSON.stringify(payload, null, 2);
    }
    response.writeHead(code, { 'Content-Type': 'application/json' });
    response.end(payload);
}
exports.writeJson = writeJson;
