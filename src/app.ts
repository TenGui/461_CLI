import { eval_single_file } from "./utils/eval_single_url";

const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  // Read the HTML content from the HTML file
  const htmlContent = fs.readFileSync('src/html/index.html', 'utf8');
  res.send(htmlContent);
});

app.get('/products', (req, res) => {
  res.send([
    {
      productId: '1011',
      price: 100,
    },
    {
      productId: '102',
      price: 150, 
    },
  ]);
});

// Add a new endpoint that accepts an "id" parameter
app.get('/package/:id/rate', async (req, res) => { // Add 'async' keyword here
  try {
    let URLs = ["https://www.npmjs.com/package/safe-regex"];
    const url_file = URLs[req.params.id]; // Get the "id" parameter from the URL

    const output = await eval_single_file(url_file);
    console.log("test");
    console.log(output);

    res.status(200).send(output);
  } catch (error) {
    res.status(500).send("The package rating system choked on at least one of the metrics");
  }
});


app.listen(port, () => {
  console.log(`Demo app is up and listening to port: ${port}`);
});
