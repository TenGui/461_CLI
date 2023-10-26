const express = require('express');
const app = express();

// Import necessary modules or functions
import { eval_single_file } from '../utils/eval_single_url'

app.get('/package/:id/rate', async (req, res) => {
  try {

    //Modify this section when database is setup
    let URLs = ["https://www.npmjs.com/package/safe-regex"];
    const url_file = URLs[req.params.id]; // Get the "id" parameter from the URL
    //
    
    const output = await eval_single_file(url_file);
    console.log("test");
    console.log(output);

    res.status(200).send(output);
  } catch (error) {
    res.status(500).send("The package rating system choked on at least one of the metrics");
  }
});

export default app;
