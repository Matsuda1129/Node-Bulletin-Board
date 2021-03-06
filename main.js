const express = require('express');
const app = express();

const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  password: 'root',
  database: 'progate',
  port: 3306,
});

connection.connect((err) => {
  if (err) {
    console.log('error connecting: ' + err.stack);
    return;
  }
  console.log('success');
});

app.get('/', (req, res) => {
  connection.query('SELECT * FROM users', (error, results) => {
    console.log(results);
    return res.send(results);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on ports ${PORT}`);
});
