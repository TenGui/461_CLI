"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var eval_single_url_1 = require("./utils/eval_single_url");
var express = require('express');
var fs = require('fs');
var app = express();
var port = 3000;
app.get('/', function (req, res) {
    // Read the HTML content from the HTML file
    var htmlContent = fs.readFileSync('src/html/index.html', 'utf8');
    res.send(htmlContent);
});
app.get('/products', function (req, res) {
    res.send([
        {
            productId: '1011',
            price: 100,
        },
        {
            productId: '102',
            price: 150,
        },
    ]);
});
// Add a new endpoint that accepts an "id" parameter
app.get('/package/:id/rate', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var URLs, url_file, output;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                URLs = ["https://www.npmjs.com/package/safe-regex"];
                url_file = URLs[req.params.id];
                return [4 /*yield*/, (0, eval_single_url_1.eval_single_file)(url_file)];
            case 1:
                output = _a.sent();
                console.log("test");
                console.log(output);
                res.send(output);
                return [2 /*return*/];
        }
    });
}); });
app.listen(port, function () {
    console.log("Demo app is up and listening to port: ".concat(port));
});
