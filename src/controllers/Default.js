'use strict';
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
exports.MyPage = exports.loginUser = exports.addUser = exports.RegistryReset = exports.PackagesList = exports.PackageUpdate = exports.PackageRetrieve = exports.PackageRate = exports.PackageDelete = exports.PackageCreate = exports.PackageByRegExGet = exports.PackageByNameGet = exports.UserPost = exports.UserDelete = exports.PackageByNameDelete = exports.CreateAuthToken = void 0;
var Default = require("../service/DefaultService");
var writer_1 = require("../utils/writer");
var database_connect_1 = require("../database_files/database_connect");
var authenticationHelper_1 = require("../authentication/authenticationHelper");
var globalToken = "";
function handleRequestAsync(fn, req, res, next) {
    var args = [];
    for (var _i = 4; _i < arguments.length; _i++) {
        args[_i - 4] = arguments[_i];
    }
    return __awaiter(this, void 0, void 0, function () {
        var tokenOut, xAuthorizationHeader, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    //Check if the token is valid. If the token is invalid, send error response. If not, pass json body to the service
                    //console.log("request path: " + req.path);
                    if (req.path != "/authenticate") {
                        tokenOut = {};
                        xAuthorizationHeader = req.header('X-Authorization');
                        if (xAuthorizationHeader !== undefined) {
                            tokenOut = (0, authenticationHelper_1.validateToken)(xAuthorizationHeader);
                        }
                        if (tokenOut["success"] != 1) {
                            tokenOut = (0, authenticationHelper_1.validateToken)(globalToken);
                        }
                        if (tokenOut["success"] != 1) {
                            return [2 /*return*/, res.status(400).send()];
                        }
                        //if the token is valid, replace the token string in the args with it's json body
                        args.pop();
                        args.push(tokenOut["token"]);
                        // console.log("popped arg: " + args.pop())
                        // console.log(JSON.stringify(tokenOut["token"]));
                        // console.log("length before push: " + args.length)
                        // console.log("length after push: " + args.push(tokenOut["token"]));
                        // console.log("")
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fn.apply(void 0, args)];
                case 2:
                    response = _a.sent();
                    (0, writer_1.writeJson)(res, response);
                    if (req.path == "/reset") {
                        globalToken = "";
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    (0, writer_1.writeJson)(res, error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function CreateAuthToken(req, res, next, body) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Default.CreateAuthToken];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, handleRequestAsync(Default.CreateAuthToken, req, res, next, body)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.CreateAuthToken = CreateAuthToken;
function PackageByNameDelete(req, res, next, name, xAuthorization) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, handleRequestAsync(Default.PackageByNameDelete, req, res, next, name, xAuthorization)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.PackageByNameDelete = PackageByNameDelete;
function UserDelete(req, res, next, userName, xAuthorization) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, handleRequestAsync(Default.UserDelete, req, res, next, userName, req.header('X-Authorization'))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.UserDelete = UserDelete;
function UserPost(req, res, next, body, xAuthorization) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, handleRequestAsync(Default.UserPost, req, res, next, body, req.header('X-Authorization'))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.UserPost = UserPost;
function PackageByNameGet(req, res, next, name, xAuthorization) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, handleRequestAsync(Default.PackageByNameGet, req, res, next, name, req.header('X-Authorization'))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.PackageByNameGet = PackageByNameGet;
function PackageByRegExGet(req, res, next, body, xAuthorization) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, handleRequestAsync(Default.PackageByRegExGet, req, res, next, body, req.header('X-Authorization'))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.PackageByRegExGet = PackageByRegExGet;
function PackageCreate(req, res, next, body, xAuthorization) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, handleRequestAsync(Default.PackageCreate, req, res, next, body, req.header('X-Authorization'))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.PackageCreate = PackageCreate;
function PackageDelete(req, res, next, id, xAuthorization) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, handleRequestAsync(Default.PackageDelete, req, res, next, id, req.header('X-Authorization'))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.PackageDelete = PackageDelete;
function PackageRate(req, res, next, id, xAuthorization) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, handleRequestAsync(Default.PackageRate, req, res, next, id, req.header('X-Authorization'))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.PackageRate = PackageRate;
function PackageRetrieve(req, res, next, id, xAuthorization) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, handleRequestAsync(Default.PackageRetrieve, req, res, next, id, req.header('X-Authorization'))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.PackageRetrieve = PackageRetrieve;
function PackageUpdate(req, res, next, body, id, xAuthorization) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log(body);
                    console.log(id);
                    console.log(xAuthorization);
                    console.log(req);
                    return [4 /*yield*/, handleRequestAsync(Default.PackageUpdate, req, res, next, body, id, req.header('X-Authorization'))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.PackageUpdate = PackageUpdate;
function PackagesList(req, res, next, body, offset, xAuthorization) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, handleRequestAsync(Default.PackagesList, req, res, next, body, offset, req.header('X-Authorization'))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.PackagesList = PackagesList;
function RegistryReset(req, res, next, xAuthorization) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // const xAuthorization = req.headers['x-authorization'];
                return [4 /*yield*/, handleRequestAsync(Default.RegistryReset, req, res, next, xAuthorization)];
                case 1:
                    // const xAuthorization = req.headers['x-authorization'];
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.RegistryReset = RegistryReset;
function addUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, username, password, query;
        return __generator(this, function (_b) {
            try {
                _a = req.body, username = _a.username, password = _a.password;
                query = 'INSERT INTO Auth (user, pass, canSearch, canUpload, canDownload, isAdmin) VALUES (?, ?, ?, ?, ?, ?)';
                database_connect_1.db.query(query, [username, password, true, true, true, true], function (err) {
                    if (err)
                        throw err;
                    res.send('User added successfully');
                });
            }
            catch (error) {
                // Handle any errors
                next(error);
            }
            return [2 /*return*/];
        });
    });
}
exports.addUser = addUser;
var axios_1 = require("axios");
function loginUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, loginUsername, loginPassword, query;
        var _this = this;
        return __generator(this, function (_b) {
            try {
                _a = req.body, loginUsername = _a.loginUsername, loginPassword = _a.loginPassword;
                query = 'SELECT * FROM Auth WHERE user = ? AND pass = ?';
                database_connect_1.db.query(query, [loginUsername, loginPassword], function (err, results) { return __awaiter(_this, void 0, void 0, function () {
                    var adminJson, serverUrl, authenticateResponse, token, authenticateError_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                console.log(results[0]);
                                if (err)
                                    throw err;
                                if (!(results[0] === undefined)) return [3 /*break*/, 1];
                                res.send('Login Failed');
                                return [3 /*break*/, 5];
                            case 1:
                                adminJson = {
                                    "User": {
                                        "name": results[0].user,
                                        "isAdmin": true
                                    },
                                    "Secret": {
                                        "password": results[0].pass
                                    }
                                };
                                _a.label = 2;
                            case 2:
                                _a.trys.push([2, 4, , 5]);
                                serverUrl = process.env.SERVER_URL || 'http://localhost:3000';
                                return [4 /*yield*/, axios_1.default.put("".concat(serverUrl, "/authenticate"), adminJson)];
                            case 3:
                                authenticateResponse = _a.sent();
                                console.log(authenticateResponse.data);
                                token = authenticateResponse.data;
                                globalToken = token;
                                res.send('Login Successful');
                                return [3 /*break*/, 5];
                            case 4:
                                authenticateError_1 = _a.sent();
                                console.error('Error in /authenticate:', authenticateError_1.message);
                                res.status(400).send('Error in /authenticate, Auth token not set!');
                                return [3 /*break*/, 5];
                            case 5: return [2 /*return*/];
                        }
                    });
                }); });
            }
            catch (error) {
                // Handle any errors
                next(error);
            }
            return [2 /*return*/];
        });
    });
}
exports.loginUser = loginUser;
function MyPage(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var filePath, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, Default.MyPage()];
                case 1:
                    filePath = _a.sent();
                    res.sendFile(filePath, function (err) {
                        if (err) {
                            console.error('Error sending the HTML file:', err);
                            res.status(400).send('Error in MyPage');
                        }
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    // Handle any errors
                    next(error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.MyPage = MyPage;
