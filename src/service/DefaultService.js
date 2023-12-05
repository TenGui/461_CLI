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
exports.MyPage = exports.RegistryReset = exports.PackagesList = exports.PackageUpdate = exports.PackageRetrieve = exports.PackageRate = exports.PackageDelete = exports.PackageCreate = exports.PackageByRegExGet = exports.PackageByNameGet = exports.PackageByNameDelete = exports.CreateAuthToken = void 0;
var writer_1 = require("../utils/writer"); // Import the response function
var path = require("path");
var compare_versions_1 = require("compare-versions");
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
        return __generator(this, function (_a) {
            return [2 /*return*/, '']; // You can return the actual value here
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
        var query, results, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    query = 'DELETE FROM PackageMetadata WHERE Name = ?';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, db.promise().execute(query, [name])];
                case 2:
                    results = (_a.sent())[0];
                    if (results.affectedRows > 0) {
                        return [2 /*return*/, (0, writer_1.respondWithCode)(200, { success: 'Package deleted successfully' })];
                    }
                    else {
                        return [2 /*return*/, (0, writer_1.respondWithCode)(404, { error: 'No package found with the specified name' })];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error(error_1);
                    return [2 /*return*/, (0, writer_1.respondWithCode)(500, { error: 'Internal Server Error' })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.PackageByNameDelete = PackageByNameDelete;
// Your code here
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
        var packageName, query, _a, rows, fields, matchedPackages, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!body.RegEx) {
                        return [2 /*return*/, (0, writer_1.respondWithCode)(404, { "Error": "There is missing field(s) in the PackageRegEx" })];
                    }
                    packageName = body.RegEx;
                    query = 'SELECT Name, version FROM PackageMetadata WHERE Name REGEXP ?';
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, db.promise().execute(query, [packageName])];
                case 2:
                    _a = _b.sent(), rows = _a[0], fields = _a[1];
                    console.log('Results:', rows);
                    if (rows.length > 0) {
                        matchedPackages = rows.map(function (pkg) { return ({
                            name: pkg.Name,
                            version: pkg.version,
                        }); });
                        return [2 /*return*/, (0, writer_1.respondWithCode)(200, matchedPackages)];
                    }
                    else {
                        return [2 /*return*/, (0, writer_1.respondWithCode)(404, { "Error": "No package found" })];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _b.sent();
                    console.error(error_2);
                    return [2 /*return*/, (0, writer_1.respondWithCode)(500, { error: 'Internal Server Error' })];
                case 4: return [2 /*return*/];
            }
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
var upload_endpoint_js_1 = require("../app_endpoints/upload_endpoint.js");
function PackageCreate(body, xAuthorization) {
    return __awaiter(this, void 0, void 0, function () {
        var Name, Content, URL, Version, JSProgram, upload, output_1, github_link, output_2, package_exist_check, _a, result, fields, output, error_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 8, , 9]);
                    Name = "";
                    Content = "";
                    URL = "";
                    Version = "";
                    JSProgram = "";
                    upload = new upload_endpoint_js_1.Upload();
                    //Check if package is given
                    if ("URL" in body && "Content" in body) {
                        console.log("Improper form, URL and Content are both set");
                        return [2 /*return*/, (0, writer_1.respondWithCode)(400, { "Error": "Improper form, URL and Content are both set" })];
                    }
                    if (!("URL" in body) && !("Content" in body)) {
                        console.log("Improper form, URL and Content are both not set");
                        return [2 /*return*/, (0, writer_1.respondWithCode)(400, { "Error": "Improper form, URL and Content are both not set" })];
                    }
                    if (!("URL" in body)) return [3 /*break*/, 2];
                    return [4 /*yield*/, upload.process(body["URL"])];
                case 1:
                    output_1 = _b.sent();
                    if (!output_1) {
                        return [2 /*return*/, (0, writer_1.respondWithCode)(400, { "Error": "Repository does not exists" })];
                    }
                    Name = output_1["repo"];
                    Content = 'N/A';
                    URL = output_1["url"];
                    Version = "1.0.5";
                    return [3 /*break*/, 5];
                case 2:
                    if (!("Content" in body)) return [3 /*break*/, 5];
                    return [4 /*yield*/, upload.decompress_zip_to_github_link(body["Content"])];
                case 3:
                    github_link = _b.sent();
                    console.log("Inside DefaultService: ", github_link);
                    if (github_link == "") {
                        return [2 /*return*/, (0, writer_1.respondWithCode)(400, { "Error": "Repository does not exists/Cannot locate package.json file" })];
                    }
                    return [4 /*yield*/, upload.process(github_link)];
                case 4:
                    output_2 = _b.sent();
                    if (!output_2) {
                        return [2 /*return*/, (0, writer_1.respondWithCode)(400, { "Error": "Repository does not exists" })];
                    }
                    Name = output_2["repo"];
                    Content = "Content";
                    URL = 'N/A';
                    Version = "1.0.0.8.2";
                    _b.label = 5;
                case 5: return [4 /*yield*/, upload.check_Package_Existence(Name, Version)];
                case 6:
                    package_exist_check = _b.sent();
                    if (package_exist_check) {
                        console.log("Upload Error: Package exists already");
                        return [2 /*return*/, (0, writer_1.respondWithCode)(409, { "Error": "Package exists already" })];
                    }
                    return [4 /*yield*/, promisePool.execute('CALL InsertPackage(?, ?, ?, ?, ?)', [
                            Name,
                            Version,
                            Content,
                            URL,
                            JSProgram,
                        ])];
                case 7:
                    _a = _b.sent(), result = _a[0], fields = _a[1];
                    output = {
                        "metadata": {
                            "Name": Name,
                            "version": Version,
                            "ID": "1"
                        },
                        "data": {
                            "JSProgram": JSProgram
                        }
                    };
                    if ("URL" in body) {
                        output["data"]["URL"] = URL;
                    }
                    else if ("Content" in body) {
                        output["data"]["Content"] = Content;
                    }
                    console.log('Packaged added successfully');
                    return [2 /*return*/, (0, writer_1.respondWithCode)(201, output)];
                case 8:
                    error_3 = _b.sent();
                    console.error('Error calling the stored procedure:', error_3);
                    throw error_3; // Re-throw the error for the caller to handle
                case 9: return [2 /*return*/];
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
var rate_endpoint_js_1 = require("../app_endpoints/rate_endpoint.js");
function PackageRate(id, xAuthorization) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, result, fields, outputURL, output, hasInvalidScore, error_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, promisePool.execute('SELECT URL FROM PackageData WHERE ID = ?', [id])];
                case 1:
                    _a = _b.sent(), result = _a[0], fields = _a[1];
                    if (!(result && result.length > 0)) return [3 /*break*/, 3];
                    outputURL = result[0].URL;
                    console.log('Retrieved URL:', outputURL);
                    return [4 /*yield*/, (0, rate_endpoint_js_1.eval_single_file)(outputURL)];
                case 2:
                    output = _b.sent();
                    hasInvalidScore = Object.values(output).some(function (score) { return score === -1; });
                    if (hasInvalidScore) {
                        return [2 /*return*/, (0, writer_1.respondWithCode)(500, { error: 'The package rating system choked on at least one of the metrics.' })];
                    }
                    return [2 /*return*/, (0, writer_1.respondWithCode)(200, output)];
                case 3: return [2 /*return*/, (0, writer_1.respondWithCode)(404, { error: "Package does not exist." })];
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_4 = _b.sent();
                    return [2 /*return*/, (0, writer_1.respondWithCode)(500, { error: 'The package rating system choked on at least one of the metrics.' })];
                case 6: return [2 /*return*/];
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
        var response, _i, body_1, query, Name, VersionRange, lower, upper, _a, result_1, fields_1, table_1, row, nextPatch, splitVersion, splitVersion, splitVersion, _b, result, fields, table, idsInRange, row, range, _c, idsInRange_1, id, _d, result_2, fields_2, basicMetadata;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    response = { 'application/json': [] };
                    _i = 0, body_1 = body;
                    _e.label = 1;
                case 1:
                    if (!(_i < body_1.length)) return [3 /*break*/, 10];
                    query = body_1[_i];
                    Name = query["Name"];
                    VersionRange = query["Version"];
                    if (!(Name == "*")) return [3 /*break*/, 3];
                    return [4 /*yield*/, promisePool.execute('SELECT Version, ID, Name FROM PackageMetadata', [])];
                case 2:
                    _a = _e.sent(), result_1 = _a[0], fields_1 = _a[1];
                    table_1 = result_1;
                    console.log(result_1, table_1);
                    if (result_1.length > 500) {
                        return [2 /*return*/, (0, writer_1.respondWithCode)(413, "Too many packages")];
                    }
                    for (row = 0; row < result_1.length; row++) {
                        response['application/json'].push(result_1[row]);
                    }
                    return [3 /*break*/, 4];
                case 3:
                    if (VersionRange.includes("-")) { // specific range
                        lower = VersionRange.split("-")[0];
                        upper = VersionRange.split("-")[1];
                        nextPatch = parseInt(upper.split(".")[2]) + 1;
                        upper = upper.substring(0, upper.length - 1) + nextPatch.toString();
                    }
                    else if (VersionRange.includes("^")) { // [2.3.1 - 3.0.0)
                        lower = VersionRange.substring(1, VersionRange.length);
                        splitVersion = lower.split(".");
                        splitVersion[0] = (parseInt(splitVersion[0]) + 1).toString();
                        splitVersion[1] = "0";
                        splitVersion[2] = "0";
                        upper = splitVersion.join(".");
                    }
                    else if (VersionRange.includes("~")) { // [2.3.1 - 2.4.0)
                        lower = VersionRange.substring(1, VersionRange.length);
                        splitVersion = lower.split(".");
                        splitVersion[1] = (parseInt(splitVersion[1]) + 1).toString();
                        splitVersion[2] = "0";
                        upper = splitVersion.join(".");
                    }
                    else { //Exact
                        lower = VersionRange;
                        splitVersion = lower.split(".");
                        splitVersion[2] = (parseInt(splitVersion[2]) + 1).toString();
                        upper = splitVersion.join(".");
                    }
                    _e.label = 4;
                case 4: return [4 /*yield*/, promisePool.execute('CALL GetIdVersionMapForPackage(?)', [Name])];
                case 5:
                    _b = _e.sent(), result = _b[0], fields = _b[1];
                    table = result[0];
                    if (table.length > 500) {
                        return [2 /*return*/, (0, writer_1.respondWithCode)(413, "Too many packages")];
                    }
                    idsInRange = [];
                    for (row = 0; row < table.length; row++) {
                        range = lower + " - " + upper;
                        if ((0, compare_versions_1.satisfies)(table[row]["version"], range)) {
                            idsInRange.push(table[row]["id"]);
                        }
                    }
                    _c = 0, idsInRange_1 = idsInRange;
                    _e.label = 6;
                case 6:
                    if (!(_c < idsInRange_1.length)) return [3 /*break*/, 9];
                    id = idsInRange_1[_c];
                    return [4 /*yield*/, promisePool.execute('CALL GetBasicMetadata(?)', [id])];
                case 7:
                    _d = _e.sent(), result_2 = _d[0], fields_2 = _d[1];
                    basicMetadata = result_2[0][0];
                    response['application/json'].push(basicMetadata);
                    _e.label = 8;
                case 8:
                    _c++;
                    return [3 /*break*/, 6];
                case 9:
                    _i++;
                    return [3 /*break*/, 1];
                case 10: 
                //console.log("\n\nRETURNED RESPONSE: ", response);
                return [2 /*return*/, (0, writer_1.respondWithCode)(200, response['application/json'])];
            }
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
var reset_endpoint_js_1 = require("../app_endpoints/reset_endpoint.js");
function RegistryReset(xAuthorization) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, reset_endpoint_js_1.resetDatabase)()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
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
