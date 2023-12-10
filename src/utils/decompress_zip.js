"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var unzipper = require("unzipper");
var base64String = '';
// Convert base64 string to Buffer
var buffer = Buffer.from(base64String, 'base64');
var readableStream = require('stream').Readable.from(buffer);
readableStream.pipe(unzipper.Parse())
    .on('entry', function (entry) {
    if (entry.path.endsWith("package.json")) {
        console.log('Found package.json in the ZIP file.');
        var contentStream = fs.createWriteStream('zip_file_package.json');
        fs.readFile("zip_file_package.json", 'utf-8', function (err, data) {
            // Parse the JSON content
            try {
                var parsedContent = JSON.parse(data);
                if (parsedContent && parsedContent['repository']) {
                    var github_link = parsedContent['repository'].url;
                    var cleaned_github_link = "https://" + github_link.substring(6, github_link.length - 4);
                    console.log(cleaned_github_link);
                }
            }
            catch (error) {
                console.error('Error parsing JSON content:', error);
            }
        });
        entry.pipe(contentStream);
    }
    else {
        entry.autodrain(); // consume the entry's data and move to the next entry
    }
})
    .on('error', function (err) {
    console.error('Error checking base64 encoded zip file:', err);
})
    .on('finish', function () {
    console.log('base64 ZIP file checked.');
});
