//Requires with const for ES6, and creating references to those requires, to acess methods from these dependencies.
const express = require('express'); //this project needs express
const MYSQL = require('mysql'); //Database created accepting certain predefined json objects
const expJWT = require('express-jwt'); //Express necessities for dealing with jwt
const JWT = require('jsonwebtoken'); //Used to have a secret with hash to enable login authorization
const bodyp = require('body-parser'); //post request body parsing?
const CORS = require('cors'); //Cross site scripting prevention?


const app = express(); //app is now a short references to express methods.


//connection to db is now created, 'db' now posses all the methods of sql inorder to query.
const db = MYSQL.createConnection({
  host: 'localhost',
  user: 'root',
  password: '6636029l',
  database: 'node_practice'
});

app.use(bodyp.json()); //middleware usses body parser on json objects.
app.use(CORS()); //uses cors module..
//this application will uses an exp tokens with secret yooo unless the route is within these two routes.
app.use(expJWT({ secret: 'yooo' }).unless({ path: ['/api/login', '/api/register'] }));


app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') return res.json({
    status: 'failed',
    reason: 'You\'re not allowed here'
  });
});

app.listen(3000, (err) => {
  if (!err) console.log('listening to 3000');
});

app.get('/', (req, res) => {
  return res.json({
    title: 'web conf',
    user: req.user
  });
});

app.post('/api/aboutme', (req, res) => {
  console.log(req.body);
  return res.send(req.body);
});

app.post('/api/register', (req, res) => {
  if (!req.body || !req.body.email || !req.body.password || !req.body.fullName) return res.json({
    status: 'failed',
    reason: 'missing credentials'
  });

  const SQL = "INSERT INTO `users` (`user_fullName`, `user_email`, `user_password`) VALUES (?, ?, ?);";
  db.query(SQL, [req.body.fullName, req.body.email, req.body.password], (err, result) => {
    if (!err) return res.json({
      status: 'success'
    });
    if (err) return res.json({
      status: 'failed'
    });
  });
});

app.post('/api/login', (req, res) => {
  if (!req.body || !req.body.email || !req.body.password) return res.json({
    status: 'failed',
    reason: 'missing credentials'
  });
  const SQL = "SELECT * FROM `users` WHERE `user_email` = ? AND `user_password` = ?;";
  db.query(SQL, [req.body.email, req.body.password], (err, rows) => {
    if (!err && rows.length) return res.json({
      status: 'success',
      user: JWT.sign(rows[0], 'yooo')
    });
    if (err) return res.json({
      status: 'failed'
    });
  });
});
