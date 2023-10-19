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
      productId: '101',
      price: 100,
    },
    {
      productId: '102',
      price: 150, 
    },
  ]);
});

app.listen(port, () => {
  console.log(`Demo app is up and listening to port: ${port}`);
});
