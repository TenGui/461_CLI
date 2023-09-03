"use strict";
/*
npm install axios
*/
exports.__esModule = true;
var axios_1 = require("axios");
var url = "https://api.github.com/users/bard";
axios_1["default"].get(url).then(function (response) {
    var user = response.data;
    console.log(user);
});
