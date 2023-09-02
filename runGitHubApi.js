"use strict";
exports.__esModule = true;
var axios_1 = require("axios");
var accessToken = 'GITHUB_TOKEN';
// Define the API URL for the repository
var apiUrl = " https://github.com/openai/chatgpt-example";
// Define headers with authorization using your access token
var headers = {
    Authorization: "token ".concat(accessToken)
};
// Use Axios to make a GET request to the GitHub API
axios_1["default"]
    .get(apiUrl, { headers: headers })
    .then(function (response) {
    if (response.status !== 200) {
        throw new Error("GitHub API request failed with status: ".concat(response.status));
    }
    var repoData = response.data;
    if (repoData && repoData.name) {
        var repoName = repoData.name;
        console.log("Repository Name: ".concat(repoName));
    }
    else {
        console.log('Repository name not found in the API response.');
    }
})["catch"](function (error) {
    console.error('Error:', error.message);
});
