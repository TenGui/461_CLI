const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');

const app = express();

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'pranav',
  password: 'sankar',
  database: 'auth_demo'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(query, [username, password], (err, results) => {
    console.log(results.length);
    if (err) throw err;

    if (results.length === 1) {
      res.send('Login Successful');
    } else {
      res.send('Login Failed');
    }
  });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



/*const express = require('express');
const mysql = require('mysql');
const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');


app.get('/divs/:count', (req, res) => {
  const divCount = parseInt(req.params.count, 10);
  res.render('divs', { divCount });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});*/
