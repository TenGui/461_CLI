const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;
import { Helper } from './database_files/authorization';


//Include all endpoints here
import package_rate_endpoint from './app_endpoints/rate_endpoint'
app.use('/', package_rate_endpoint);

import router from './app_endpoints/database';
app.use(router)

//Home Page
app.get('/', (req, res) => {
  // Read the HTML content from the HTML file
  const helper = new Helper();
  helper.setEnvVariables();
  const htmlContent = fs.readFileSync('src/html/index.html', 'utf8');
  res.send(htmlContent);
});

app.listen(port, () => {
  console.log(`Demo app is up and listening to port: ${port}`);
});
