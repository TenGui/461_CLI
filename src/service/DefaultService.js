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
exports.UserPost = exports.UserDelete = exports.MyPage = exports.RegistryReset = exports.PackagesList = exports.PackageUpdate = exports.PackageRetrieve = exports.PackageRate = exports.PackageDelete = exports.PackageCreate = exports.PackageByRegExGet = exports.PackageByNameGet = exports.PackageByNameDelete = exports.CreateAuthToken = void 0;
var writer_1 = require("../utils/writer"); // Import the response function
var path = require("path");
var authHelper = require("../authentication/authenticationHelper");
var _a = require("../database_files/database_connect"), db = _a.db, promisePool = _a.promisePool;
// const queryAsync = util.promisify(pool.query);
/**
 * Create an access token.
 *
 * @param body AuthenticationRequest
 * @returns AuthenticationToken
 **/
function CreateAuthToken(body) {
    return __awaiter(this, void 0, void 0, function () {
        var username, password, _a, result, fields, token;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    username = body.User.name;
                    password = body.Secret.password;
                    return [4 /*yield*/, promisePool.execute('SELECT * FROM Auth WHERE user = \'' + username + '\'')];
                case 1:
                    _a = _b.sent(), result = _a[0], fields = _a[1];
                    if (result.length == 0) {
                        return [2 /*return*/, (0, writer_1.respondWithCode)(401, "User is not in database")];
                    }
                    //console.log("result: " + JSON.stringify(result));
                    // If credentials are valid, create a JWT with permissions that correspond to that of the user
                    //console.log("password check: incoming = " + password + " database = "+ result[0].pass);
                    if (password === result[0].pass) {
                        token = authHelper.createToken({
                            user: username,
                            pass: result[0].pass,
                            canSearch: result[0].canSearch,
                            canUpload: result[0].canUpload,
                            canDownload: result[0].canDownload
                        });
                        return [2 /*return*/, (0, writer_1.respondWithCode)(200, "\"bearer " + token + "\"")];
                    }
                    else {
                        //console.log("bad password");
                        return [2 /*return*/, (0, writer_1.respondWithCode)(401, "User exists. Wrong password")];
                    }
                    return [2 /*return*/, '']; // You can return the actual value here
            }
        });
    });
}
exports.CreateAuthToken = CreateAuthToken;
/**
 * Delete all versions of this package.
 *
 * @param xAuthorization AuthenticationToken
 * @param name PackageName
 * @returns void
 **/
function PackageByNameDelete(name, xAuthorization) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // Your code here
            console.log("--here is the token: " + xAuthorization);
            console.log("--here is the pacakge name" + name);
            console.log("This is the dumbest thing in the world ");
            return [2 /*return*/, (0, writer_1.respondWithCode)(200, "gaming")];
        });
    });
}
exports.PackageByNameDelete = PackageByNameDelete;
/**
 * Return the history of this package (all versions).
 *
 * @param name PackageName
 * @param xAuthorization AuthenticationToken
 * @returns List
 **/
function PackageByNameGet(name, xAuthorization) {
    return __awaiter(this, void 0, void 0, function () {
        var examples;
        return __generator(this, function (_a) {
            examples = {};
            examples['application/json'] = [
                {
                    "Action": "CREATE",
                    "User": {
                        "name": "Alfalfa",
                        "isAdmin": true
                    },
                    "PackageMetadata": {
                        "Version": "1.2.3",
                        "ID": "ID",
                        "Name": "Name"
                    },
                    "Date": "2023-03-23T23:11:15Z"
                },
                {
                    "Action": "CREATE",
                    "User": {
                        "name": "Alfalfa",
                        "isAdmin": true
                    },
                    "PackageMetadata": {
                        "Version": "1.2.3",
                        "ID": "ID",
                        "Name": "Name"
                    },
                    "Date": "2023-03-23T23:11:15Z"
                },
            ];
            return [2 /*return*/, examples['application/json']];
        });
    });
}
exports.PackageByNameGet = PackageByNameGet;
/**
 * Get any packages fitting the regular expression.
 * Search for a package using a regular expression over package names and READMEs. This is similar to search by name.
 *
 * @param body PackageRegEx
 * @param xAuthorization AuthenticationToken
 * @returns List
 **/
function PackageByRegExGet(body, xAuthorization) {
    return __awaiter(this, void 0, void 0, function () {
        var examples;
        return __generator(this, function (_a) {
            examples = {};
            examples['application/json'] = [
                {
                    "Version": "1.2.3",
                    "ID": "ID",
                    "Name": "Name"
                },
                {
                    "Version": "1.2.3",
                    "ID": "ID",
                    "Name": "Name"
                },
            ];
            return [2 /*return*/, examples['application/json']];
        });
    });
}
exports.PackageByRegExGet = PackageByRegExGet;
/**
 *
 * @param body PackageData
 * @param xAuthorization AuthenticationToken
 * @returns Package
 **/
function PackageCreate(body, xAuthorization) {
    return __awaiter(this, void 0, void 0, function () {
        var Name, Version, Content, URL_1, JSProgram, DataDescription, _a, result, fields, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    Name = "Package_Name11";
                    Version = "1.0.0.8.2";
                    Content = 'LONG_TEXT10';
                    URL_1 = 'LONG_TEXT1234';
                    JSProgram = 'JSPROGRAM325';
                    DataDescription = 'DATA226';
                    return [4 /*yield*/, promisePool.execute('CALL InsertPackage(?, ?, ?, ?, ?, ?)', [
                            Name,
                            Version,
                            Content,
                            URL_1,
                            JSProgram,
                        ])];
                case 1:
                    _a = _b.sent(), result = _a[0], fields = _a[1];
                    //connection.release();
                    console.log(result);
                    console.log(typeof (result));
                    console.log('Stored procedure executed successfully.');
                    return [2 /*return*/, (0, writer_1.respondWithCode)(201, "testing")];
                case 2:
                    error_1 = _b.sent();
                    console.error('Error calling the stored procedure:', error_1);
                    throw error_1; // Re-throw the error for the caller to handle
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.PackageCreate = PackageCreate;
/**
 * Delete this version of the package.
 *
 * @param xAuthorization AuthenticationToken
 * @param id PackageID Package ID
 * @returns void
 **/
function PackageDelete(id, xAuthorization) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/];
        });
    });
}
exports.PackageDelete = PackageDelete;
/**
 *
 * @param id PackageID
 * @param xAuthorization AuthenticationToken
 * @returns PackageRating
 **/
var eval_single_url_js_1 = require("../utils/eval_single_url.js");
function PackageRate(id, xAuthorization) {
    return __awaiter(this, void 0, void 0, function () {
        var URLs, url_file, output;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    URLs = ["https://github.com/knex/knex"];
                    url_file = URLs[id];
                    return [4 /*yield*/, (0, eval_single_url_js_1.eval_single_file)(url_file)];
                case 1:
                    output = _a.sent();
                    console.log(output);
                    return [2 /*return*/, output];
            }
        });
    });
}
exports.PackageRate = PackageRate;
/**
 * Interact with the package with this ID
 * Return this package.
 *
 * @param xAuthorization AuthenticationToken
 * @param id PackageID ID of package to fetch
 * @returns Package
 **/
function PackageRetrieve(id, xAuthorization) {
    return __awaiter(this, void 0, void 0, function () {
        var examples, connection, isResultSetHeader;
        return __generator(this, function (_a) {
            examples = {};
            examples['application/json'] = {
                "metadata": {
                    "Version": "1.2.3",
                    "ID": "ID",
                    "Name": "Name",
                },
                "data": {
                    "Content": "Content",
                    "JSProgram": "JSProgram",
                    "URL": "URL",
                },
            };
            try {
                connection = void 0;
                isResultSetHeader = function (data) {
                    if (!data || typeof data !== 'object')
                        return false;
                    var keys = [
                        'fieldCount',
                        'affectedRows',
                        'insertId',
                        'info',
                        'serverStatus',
                        'warningStatus',
                        'changedRows',
                    ];
                    return keys.every(function (key) { return key in data; });
                };
                // results.forEach((users) => {
                //   if (isResultSetHeader(users)) {
                //     console.log('----------------');
                //     console.log('Affected Rows:', users.affectedRows);
                //   } else {  
                //     users.forEach((user) => {
                //       console.log('----------------');
                //       console.log('id:  ', user.ID);
                //       console.log('name:', user.Name);
                //       console.log('URL: ', user.URL);
                //     });
                //   }
                // });
                // const [results, fields] = await promisePool.execute<test[]>('SELECT * FROM Package', []);
                // const response = (results[0][0] as { response: YourResponseType }).response;
                // console.log(typeof(results));
                // console.log(results[0][0].v_JSON);
                // const selectResult: RowDataPacket[] = results[0] as RowDataPacket[];
                //   console.log(results);
                //   // console.log(fields);
                //   return respondWithCode(200, results[0][0]);
            }
            catch (error) {
                console.error('Error calling the stored procedure:', error);
                throw error; // Re-throw the error for the caller to handle
            }
            return [2 /*return*/, examples['application/json']];
        });
    });
}
exports.PackageRetrieve = PackageRetrieve;
/**
 * Update this content of the package.
 * The name, version, and ID must match.  The package contents (from PackageData) will replace the previous contents.
 *
 * @param body Package
 * @param id PackageID
 * @param xAuthorization AuthenticationToken
 * @returns void
 **/
function PackageUpdate(body, id, xAuthorization) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/];
        });
    });
}
exports.PackageUpdate = PackageUpdate;
/**
 * Get the packages from the registry.
 * Get any packages fitting the query. Search for packages satisfying the indicated query.  If you want to enumerate all packages, provide an array with a single PackageQuery whose name is "*".  The response is paginated; the response header includes the offset to use in the next query.
 *
 * @param body List
 * @param offset string Provide this for pagination. If not provided, returns the first page of results. (optional)
 * @param xAuthorization AuthenticationToken
 * @returns List
 **/
function PackagesList(body, offset, xAuthorization) {
    return __awaiter(this, void 0, void 0, function () {
        var examples;
        return __generator(this, function (_a) {
            examples = {};
            examples['application/json'] = [
                {
                    "Version": "1.2.3",
                    "ID": "ID",
                    "Name": "Name",
                },
                {
                    "Version": "1.2.3",
                    "ID": "ID",
                    "Name": "Name",
                },
            ];
            return [2 /*return*/, examples['application/json']];
        });
    });
}
exports.PackagesList = PackagesList;
/**
 * Reset the registry
 * Reset the registry to a system default state.
 *
 * @param xAuthorization AuthenticationToken
 * @returns void
 **/
function RegistryReset(xAuthorization) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/];
        });
    });
}
exports.RegistryReset = RegistryReset;
function MyPage() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, path.join(__dirname, '..', 'html', 'login.html')];
        });
    });
}
exports.MyPage = MyPage;
/**
 * Add a new user to the system.
 * Request to add a new user to the system. Requires an admin token.
 *
 * xAuthorization AuthenticationToken
 * userName userName user to be deleted
 * no response value expected for this operation
 **/
function UserDelete(xAuthorization, userName) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, ''];
        });
    });
}
exports.UserDelete = UserDelete;
/**
 * Add a new user to the system.
 * Request to add a new user to the system. Requires an admin token.
 *
 * body List
 * xAuthorization AuthenticationToken
 * no response value expected for this operation
 **/
function UserPost(body, xAuthorization) {
    return __awaiter(this, void 0, void 0, function () {
        var queryString;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    queryString = 'INSERT INTO Auth VALUES (\'' + body.user + '\', \'' + body.pass + '\', ' + body.canSearch + ', ' + body.canUpload + ', ' + body.canDownload + ', ' + body.isAdmin + ')';
                    return [4 /*yield*/, promisePool.execute(queryString)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, (0, writer_1.respondWithCode)(200, "Successfully added user " + body.user)];
            }
        });
    });
}
exports.UserPost = UserPost;
