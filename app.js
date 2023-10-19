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
            productId: '101',
            price: 100,
        },
        {
            productId: '102',
            price: 150,
        },
    ]);
});
app.listen(port, function () {
    console.log("Demo app is up and listening to port: ".concat(port));
});
