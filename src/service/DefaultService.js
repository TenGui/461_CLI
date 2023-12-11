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
exports.PackageByNameDelete = exports.UserPost = exports.UserDelete = exports.MyPage = exports.RegistryReset = exports.PackagesList = exports.PackageUpdate = exports.PackageRetrieve = exports.PackageRate = exports.PackageDelete = exports.PackageCreate = exports.PackageByRegExGet = exports.PackageByNameGet = exports.CreateAuthToken = void 0;
var writer_1 = require("../utils/writer"); // Import the response function
var path = require("path");
var compare_versions_1 = require("compare-versions");
var authHelper = require("../authentication/authenticationHelper");
var cheerio = require('cheerio');
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
                    //console.log("authentication endpoint hit");
                    if (authHelper.getAuthEnable() == '0') {
                        return [2 /*return*/, (0, writer_1.respondWithCode)(501, "This system does not support authentication.")];
                    }
                    username = body.User.name;
                    password = body.Secret.password;
                    return [4 /*yield*/, promisePool.execute('SELECT * FROM Auth WHERE user = ?', [username])];
                case 1:
                    _a = _b.sent(), result = _a[0], fields = _a[1];
                    //console.log("result at service: " + JSON.stringify(result));
                    //console.log("fields at service: " + JSON.stringify(fields));
                    if (result.length == 0) {
                        return [2 /*return*/, (0, writer_1.respondWithCode)(401, "User is not in database")];
                    }
                    //console.log("result: " + JSON.stringify(result));
                    //console.log("AUTH TABLE ROW: " + JSON.stringify(result));
                    // If credentials are valid, create a JWT with permissions that correspond to that of the user
                    //console.log("password check: incoming = " + password + " database = "+ result[0].pass);
                    if (password === result[0].pass) {
                        token = authHelper.createToken({
                            user: username,
                            pass: result[0].pass,
                            isAdmin: result[0].isAdmin,
                            canSearch: result[0].canSearch,
                            canUpload: result[0].canUpload,
                            canDownload: result[0].canDownload
                        });
                        return [2 /*return*/, (0, writer_1.respondWithCode)(200, "\"bearer " + token + "\"")];
                    }
                    else {
                        //console.log("bad password");
                        //console.log("Given pw: " + password);
                        //console.log("DB pw:    " + result[0].pass);
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
function PackageByNameGet(name, xAuthorization) {
    return __awaiter(this, void 0, void 0, function () {
        var query, _a, rows, fields, output, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    query = 'SELECT * FROM PackageMetadata WHERE Name = ?';
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, db.promise().execute(query, [name])];
                case 2:
                    _a = _b.sent(), rows = _a[0], fields = _a[1];
                    console.log('Results:', rows);
                    if (rows.length > 0) {
                        output = rows.map(function (pkg) { return ({
                            User: {
                                name: 'Pranav',
                                isAdmin: true
                            },
                            Date: pkg.date_column.toISOString(),
                            PackageMetadata: {
                                Name: pkg.Name,
                                Version: pkg.version,
                                ID: pkg.id
                            },
                            Action: 'DOWNLOAD'
                        }); });
                        return [2 /*return*/, (0, writer_1.respondWithCode)(200, output)];
                    }
                    else {
                        return [2 /*return*/, (0, writer_1.respondWithCode)(404, { "Error": "No package found" })];
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _b.sent();
                    console.error(error_1);
                    return [2 /*return*/, (0, writer_1.respondWithCode)(error_1.response.status, { "Error": 'ByRegex Error' })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.PackageByNameGet = PackageByNameGet;
/**
 * Return the history of this package (all versions).
 *
 * @param name PackageName
 * @param xAuthorization AuthenticationToken
 * @returns List
 **/
/**
 * Get any packages fitting the regular expression.
 * Search for a package using a regular expression over package names and READMEs. This is similar to search by name.
 *
 * @param body PackageRegEx
 * @param xAuthorization AuthenticationToken
 * @returns List
 **/
function PackageByRegExGet(body, xAuthorization) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var packageName, safe, queryName, queryReadme, _b, rowsName, fieldsName, matchedPackagesName, _c, rowsReadme, fieldsReadme, matchedPackagesReadme, error_2;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!body.RegEx) {
                        return [2 /*return*/, (0, writer_1.respondWithCode)(404, { "Error": "There is a missing field(s) in the PackageRegEx" })];
                    }
                    packageName = body.RegEx;
                    safe = require('safe-regex');
                    if (!safe(packageName)) {
                        return [2 /*return*/, (0, writer_1.respondWithCode)(404, { "Error": "unSafe Regex" })];
                    }
                    queryName = "\n    SELECT PM.Name, PM.version\n    FROM PackageMetadata PM\n    WHERE PM.Name REGEXP ?;\n  ";
                    queryReadme = "\n    SELECT PM.Name, PM.version\n    FROM PackageMetadata PM\n    LEFT JOIN PackageData PD ON PM.ID = PD.ID\n    WHERE PD.Readme REGEXP ?;\n  ";
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, db.promise().execute(queryName, [packageName])];
                case 2:
                    _b = _d.sent(), rowsName = _b[0], fieldsName = _b[1];
                    if (!(rowsName.length > 0)) return [3 /*break*/, 3];
                    matchedPackagesName = rowsName.map(function (pkg) { return ({
                        name: pkg.Name,
                        version: pkg.version,
                    }); });
                    return [2 /*return*/, (0, writer_1.respondWithCode)(200, matchedPackagesName)];
                case 3: return [4 /*yield*/, db.promise().execute(queryReadme, [packageName])];
                case 4:
                    _c = _d.sent(), rowsReadme = _c[0], fieldsReadme = _c[1];
                    if (rowsReadme.length > 0) {
                        matchedPackagesReadme = rowsReadme.map(function (pkg) { return ({
                            name: pkg.Name,
                            version: pkg.version,
                        }); });
                        return [2 /*return*/, (0, writer_1.respondWithCode)(200, matchedPackagesReadme)];
                    }
                    else {
                        return [2 /*return*/, (0, writer_1.respondWithCode)(404, { "Error": "No package found" })];
                    }
                    _d.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_2 = _d.sent();
                    console.error(error_2);
                    return [2 /*return*/, (0, writer_1.respondWithCode)(((_a = error_2.response) === null || _a === void 0 ? void 0 : _a.status) || 500, { "Error": 'Error in RegexGet' })];
                case 7: return [2 /*return*/];
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
var github_to_base64_js_1 = require("../utils/github_to_base64.js");
var version_js_1 = require("../utils/version.js");
function PackageCreate(body, xAuthorization) {
    return __awaiter(this, void 0, void 0, function () {
        var Name, Content, URL, Version, JSProgram, README, upload, newBody, output_1, package_exist_check_1, _a, zipContent, readmeContent, zip_base64, contentstring, decodedContent, errorMessage, github_link, output_2, readmeResponse, readmeText, $, package_exist_check, _b, result, fields, output, error_3;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 14, , 15]);
                    Name = "";
                    Content = "";
                    URL = "";
                    Version = "";
                    JSProgram = "";
                    README = "";
                    upload = new upload_endpoint_js_1.Upload();
                    newBody = Object.fromEntries(Object.entries(body).map(function (_a) {
                        var key = _a[0], value = _a[1];
                        return [key.toLowerCase(), value];
                    }));
                    if (!("url" in newBody) && !("content" in newBody)) {
                        console.log("Improper form, URL and Content are both not set");
                        return [2 /*return*/, (0, writer_1.respondWithCode)(400, { "Error": "Improper form, URL and Content are both not set" })];
                    }
                    if (!("url" in newBody)) return [3 /*break*/, 5];
                    return [4 /*yield*/, upload.process(newBody["url"])];
                case 1:
                    output_1 = _c.sent();
                    if (!output_1) {
                        return [2 /*return*/, (0, writer_1.respondWithCode)(400, { "Error": "Repository does not exists" })];
                    }
                    Name = output_1["repo"];
                    URL = output_1["url"];
                    return [4 /*yield*/, (0, version_js_1.getGitHubPackageVersion)(output_1["url"])];
                case 2:
                    Version = _c.sent();
                    return [4 /*yield*/, upload.check_Package_Existence(Name, Version)];
                case 3:
                    package_exist_check_1 = _c.sent();
                    if (package_exist_check_1) {
                        console.log("Upload Error: Package exists already");
                        return [2 /*return*/, (0, writer_1.respondWithCode)(409, { "Error": "Package exists already" })];
                    }
                    return [4 /*yield*/, (0, github_to_base64_js_1.fetchGitHubData)(output_1["owner"], output_1["repo"], output_1["url"])];
                case 4:
                    _a = _c.sent(), zipContent = _a.zipContent, readmeContent = _a.readmeContent;
                    zip_base64 = Buffer.from(zipContent).toString('base64');
                    Content = zip_base64;
                    README = readmeContent;
                    JSProgram = newBody["jsprogram"];
                    return [3 /*break*/, 11];
                case 5:
                    if (!("content" in newBody)) return [3 /*break*/, 11];
                    if (typeof newBody["content"] != 'string') {
                        return [2 /*return*/, (0, writer_1.respondWithCode)(400, { "Error": "Content has to be string" })];
                    }
                    if (typeof newBody["content"] === 'string' && newBody["content"].trim() !== '') {
                        try {
                            contentstring = newBody["content"];
                            decodedContent = atob(contentstring);
                        }
                        catch (error) {
                            errorMessage = "Not a valid base64-encoded zip file";
                            console.log("error", errorMessage);
                            return [2 /*return*/, (0, writer_1.respondWithCode)(400, { "Error": errorMessage })];
                        }
                    }
                    return [4 /*yield*/, upload.decompress_zip_to_github_link(newBody["content"])];
                case 6:
                    github_link = _c.sent();
                    if (github_link == "") {
                        return [2 /*return*/, (0, writer_1.respondWithCode)(400, { "Error": "Repository does not exists/Cannot locate package.json file" })];
                    }
                    return [4 /*yield*/, upload.process(github_link)];
                case 7:
                    output_2 = _c.sent();
                    if (!output_2) {
                        return [2 /*return*/, (0, writer_1.respondWithCode)(400, { "Error": "Repository does not exists" })];
                    }
                    return [4 /*yield*/, fetch(output_2["url"] + '/blob/HEAD/README.md')];
                case 8:
                    readmeResponse = _c.sent();
                    return [4 /*yield*/, readmeResponse.text()];
                case 9:
                    readmeText = _c.sent();
                    $ = cheerio.load(readmeText);
                    README = $('article').text();
                    Name = output_2["repo"];
                    Content = newBody["content"];
                    URL = output_2["url"];
                    return [4 /*yield*/, (0, version_js_1.getGitHubPackageVersion)(output_2["url"])];
                case 10:
                    Version = _c.sent();
                    JSProgram = newBody["jsprogram"];
                    _c.label = 11;
                case 11: return [4 /*yield*/, upload.check_Package_Existence(Name, Version)];
                case 12:
                    package_exist_check = _c.sent();
                    if (package_exist_check) {
                        console.log("Upload Error: Package exists already");
                        return [2 /*return*/, (0, writer_1.respondWithCode)(409, { "Error": "Package exists already" })];
                    }
                    return [4 /*yield*/, promisePool.execute('CALL InsertPackage(?, ?, ?, ?, ?, ?)', [
                            Name,
                            Version,
                            Content,
                            README,
                            URL,
                            JSProgram
                        ])];
                case 13:
                    _b = _c.sent(), result = _b[0], fields = _b[1];
                    output = {
                        "metadata": {
                            "Name": Name,
                            "version": Version,
                            "ID": String(result[0][0].packageID)
                        },
                        "data": {
                            "Content": Content
                        }
                    };
                    // if("URL" in body){
                    //   output["data"]["URL"] = URL;
                    // }
                    // else if("Content" in body){
                    //   output["data"]["Content"] = Content;
                    // }
                    console.log('Packaged added successfully');
                    return [2 /*return*/, (0, writer_1.respondWithCode)(201, output)];
                case 14:
                    error_3 = _c.sent();
                    console.log('Upload error:', error_3);
                    return [2 /*return*/, (0, writer_1.respondWithCode)(400, JSON.stringify("Upload errors: " + error_3))];
                case 15: return [2 /*return*/];
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
        var _a, result, fields, error_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, promisePool.execute('CALL PackageDelete(?)', [id])];
                case 1:
                    _a = _b.sent(), result = _a[0], fields = _a[1];
                    if (result.affectedRows === 1) {
                        return [2 /*return*/, (0, writer_1.respondWithCode)(200)];
                    }
                    else {
                        return [2 /*return*/, (0, writer_1.respondWithCode)(404)];
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _b.sent();
                    console.log(error_4);
                    throw error_4;
                case 3: return [2 /*return*/];
            }
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
        var _a, result, fields, outputURL, output, hasInvalidScore, error_5;
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
                        return [2 /*return*/, (0, writer_1.respondWithCode)(500, { "Error": 'The package rating system choked on at least one of the metrics.' })];
                    }
                    return [2 /*return*/, (0, writer_1.respondWithCode)(200, output)];
                case 3: return [2 /*return*/, (0, writer_1.respondWithCode)(404, { "Error": "Package does not exist." })];
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_5 = _b.sent();
                    return [2 /*return*/, (0, writer_1.respondWithCode)(500, { "Error": 'The package rating system choked on at least one of the metrics.' })];
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
        var query, values, results, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    query = 'CALL GetPackage(?)';
                    values = [id];
                    return [4 /*yield*/, promisePool.execute(query, values)];
                case 1:
                    results = (_a.sent())[0];
                    //console.log(results);
                    if (results[0].length === 0) {
                        return [2 /*return*/, (0, writer_1.respondWithCode)(404)];
                    }
                    else {
                        return [2 /*return*/, (0, writer_1.respondWithCode)(200, results[0][0])];
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_6 = _a.sent();
                    console.error('Error calling the stored procedure:', error_6);
                    throw error_6;
                case 3: return [2 /*return*/];
            }
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
        var results, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (Object.keys(body.data).length != 1 || (!("URL" in body.data) && !("Content" in body.data) && !("JSProgram" in body.data))) {
                        return [2 /*return*/, (0, writer_1.respondWithCode)(400, { "Error": "Improper form" })];
                    }
                    return [4 /*yield*/, promisePool.execute('CALL PackageUpdate(?, ?, ?, ?, ?, ?)', [
                            id,
                            body.metadata.Name,
                            body.metadata.Version,
                            body.data.Content || null,
                            body.data.URL || null,
                            body.data.JSProgram || null // Replace undefined with null for JSProgram
                        ])];
                case 1:
                    results = (_a.sent())[0];
                    if (results[0][0].updateSuccess == 0) {
                        return [2 /*return*/, (0, writer_1.respondWithCode)(404)];
                    }
                    else {
                        return [2 /*return*/, (0, writer_1.respondWithCode)(200)];
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_7 = _a.sent();
                    console.log(error_7);
                    throw error_7;
                case 3: return [2 /*return*/];
            }
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
        var response, _i, body_1, query, Name, VersionRange, lower, upper, table, sql_all, _a, result, fields, _b, result, fields, idsInRange, row, _c, idsInRange_1, id, _d, result, fields, basicMetadata, err_1;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    response = { 'application/json': [] };
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 12, , 13]);
                    _i = 0, body_1 = body;
                    _e.label = 2;
                case 2:
                    if (!(_i < body_1.length)) return [3 /*break*/, 11];
                    query = body_1[_i];
                    Name = query["Name"];
                    VersionRange = query["Version"];
                    //Clean Version Range
                    if (VersionRange != undefined) {
                        if (VersionRange.includes("-")) {
                            VersionRange = VersionRange.split("-")[0] + " - " + VersionRange.split("-")[1];
                        }
                    }
                    if (!(Name == "*")) return [3 /*break*/, 4];
                    sql_all = 'SELECT ID AS \'id\', Version AS \'version\' FROM PackageMetadata';
                    return [4 /*yield*/, promisePool.execute(sql_all, [])];
                case 3:
                    _a = _e.sent(), result = _a[0], fields = _a[1];
                    table = result;
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, promisePool.execute('CALL GetIdVersionMapForPackage(?)', [Name])];
                case 5:
                    _b = _e.sent(), result = _b[0], fields = _b[1];
                    table = result[0];
                    _e.label = 6;
                case 6:
                    //console.log("Table: ", table);
                    if (table.length > 500) {
                        return [2 /*return*/, (0, writer_1.respondWithCode)(413, "Too many packages")];
                    }
                    idsInRange = [];
                    for (row = 0; row < table.length; row++) {
                        //console.log("satisfies inputs: ", table[row]["version"], VersionRange, satisfies(table[row]["version"], VersionRange));
                        if (VersionRange == "*" || VersionRange == undefined || (0, compare_versions_1.satisfies)(table[row]["version"], VersionRange)) {
                            idsInRange.push(table[row]["id"]);
                        }
                    }
                    _c = 0, idsInRange_1 = idsInRange;
                    _e.label = 7;
                case 7:
                    if (!(_c < idsInRange_1.length)) return [3 /*break*/, 10];
                    id = idsInRange_1[_c];
                    return [4 /*yield*/, promisePool.execute('SELECT Version, ID, Name FROM PackageMetadata WHERE ID = ?', [id])];
                case 8:
                    _d = _e.sent(), result = _d[0], fields = _d[1];
                    basicMetadata = result[0];
                    //console.log("id: ", id, " corresp Metadata: ", result);
                    response['application/json'].push(basicMetadata);
                    _e.label = 9;
                case 9:
                    _c++;
                    return [3 /*break*/, 7];
                case 10:
                    _i++;
                    return [3 /*break*/, 2];
                case 11:
                    //apply the offset to the response
                    response['application/json'] = response['application/json'].slice(offset);
                    return [3 /*break*/, 13];
                case 12:
                    err_1 = _e.sent();
                    return [2 /*return*/, (0, writer_1.respondWithCode)(400, "Error happened\n " + err_1.stack)];
                case 13: 
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
/**
 * Add a new user to the system.
 * Request to add a new user to the system. Requires an admin token.
 *
 * xAuthorization AuthenticationToken
 * userName userName user to be deleted
 * no response value expected for this operation
 **/
function UserDelete(userName, xAuthorization) {
    return __awaiter(this, void 0, void 0, function () {
        var queryString, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    //console.log("end function isAdmin: " + xAuthorization["isAdmin"]);
                    if (xAuthorization["isAdmin"] != 1 && userName != xAuthorization["user"]) {
                        return [2 /*return*/, (0, writer_1.respondWithCode)(400, "Your token is valid, but you do not have proper permissions")];
                    }
                    queryString = 'DELETE FROM Auth WHERE user=?';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, promisePool.execute(queryString, [userName])];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    return [2 /*return*/, (0, writer_1.respondWithCode)(400, "Error happened " + err_2)];
                case 4: return [2 /*return*/, (0, writer_1.respondWithCode)(200, "Successfully deleted user " + userName)];
            }
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
                    if (xAuthorization["isAdmin"] != 1) {
                        return [2 /*return*/, (0, writer_1.respondWithCode)(400, "Your token is valid, but you do not have proper permissions")];
                    }
                    queryString = 'INSERT INTO Auth VALUES (?,?,?,?,?,?)';
                    return [4 /*yield*/, promisePool.execute(queryString, [body.user, body.pass, body.canSearch, body.canUpload, body.canDownload, body.isAdmin])];
                case 1:
                    _a.sent();
                    return [2 /*return*/, (0, writer_1.respondWithCode)(200, "Successfully added user " + body.user)];
            }
        });
    });
}
exports.UserPost = UserPost;
// 'use strict';
// import { Request, Response } from 'express';
// import { pool } from '../index.js';
// import type { AuthenticationRequest, AuthenticationToken, PackageName, PackageRegEx, PackageData, PackageMetadata, PackageID, PackageRating, Package, List } from '../utils/types';
// import util from 'util';
// /**
//  * Create an access token.
//  *
//  * @param body AuthenticationRequest 
//  * @returns AuthenticationToken
//  **/
// export function CreateAuthToken(body: AuthenticationRequest) {
//   return new Promise(function(resolve, reject) {
//     const examples: any = {};
//     examples['application/json'] = "";
//     if (Object.keys(examples).length > 0) {
//       resolve(examples[Object.keys(examples)[0]]);
//     } else {
//       //resolve();
//     }
//   });
// }
/**
 * Delete all versions of this package.
 *
 * @param xAuthorization AuthenticationToken
 * @param name PackageName
 * @returns void
 **/
function PackageByNameDelete(name, xAuthorization) {
    return __awaiter(this, void 0, void 0, function () {
        var packageNameToDelete, getIdsQuery, results, packageIds, _i, packageIds_1, id, _a, deleteResult, deleteFields, error_8;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    packageNameToDelete = name;
                    getIdsQuery = 'SELECT ID FROM PackageMetadata WHERE Name = ?';
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            db.query(getIdsQuery, [packageNameToDelete], function (err, results) {
                                if (err) {
                                    console.error(err);
                                    reject(err);
                                }
                                resolve(results);
                            });
                        })];
                case 2:
                    results = _b.sent();
                    if (results.length === 0) {
                        return [2 /*return*/, (0, writer_1.respondWithCode)(404)]; // No package found
                    }
                    packageIds = results.map(function (result) { return result.ID; });
                    _i = 0, packageIds_1 = packageIds;
                    _b.label = 3;
                case 3:
                    if (!(_i < packageIds_1.length)) return [3 /*break*/, 6];
                    id = packageIds_1[_i];
                    return [4 /*yield*/, promisePool.execute('CALL PackageDelete(?)', [id])];
                case 4:
                    _a = _b.sent(), deleteResult = _a[0], deleteFields = _a[1];
                    _b.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6: return [2 /*return*/, (0, writer_1.respondWithCode)(200)]; // OK
                case 7:
                    error_8 = _b.sent();
                    console.error(error_8);
                    return [2 /*return*/, (0, writer_1.respondWithCode)(499)]; // Internal Server Error
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.PackageByNameDelete = PackageByNameDelete;
