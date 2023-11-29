import { parse } from 'dotenv';
import * as fs from 'fs';
import * as unzipper from 'unzipper';

const base64String = '';

// Convert base64 string to Buffer
const buffer = Buffer.from(base64String, 'base64');

const readableStream = require('stream').Readable.from(buffer);

readableStream.pipe(unzipper.Parse())
  .on('entry', (entry: unzipper.Entry) => {
    if (entry.path.endsWith("package.json")) {
      console.log('Found package.json in the ZIP file.');

      const contentStream = fs.createWriteStream('zip_file_package.json');
      fs.readFile("zip_file_package.json", 'utf-8', (err, data) => {      
        // Parse the JSON content
        try {
          const parsedContent = JSON.parse(data);
          if(parsedContent && parsedContent['repository']){
            const github_link = parsedContent['repository'].url
            const cleaned_github_link = "https://" + github_link.substring(6,github_link.length-4);
            console.log(cleaned_github_link);
          }
        } catch (error) {
          console.error('Error parsing JSON content:', error);
        }
      });

      entry.pipe(contentStream);
    } else {
      entry.autodrain(); // consume the entry's data and move to the next entry
    }
  })
  .on('error', (err: Error) => {
    console.error('Error checking base64 encoded zip file:', err);
  })
  .on('finish', () => {
    console.log('base64 ZIP file checked.');
  });
