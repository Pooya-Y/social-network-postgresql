const express = require("express");
const { Pool, Client } = require('pg')
const users = require("./routes/users");

const app = express();

const cors = require("cors");
require('dotenv/config');

app.use(cors());
app.options("*", cors);
app.use(express.json());


app.use("/api/users", users);

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sn',
  password: 'pooya67206720',
  port: 5432,
})
// pool.query('SELECT NOW()', (err, res) => {
//     console.log(err, res.rows[0])
//     pool.end()
//   })
// app.use('/uploads', express.static(__dirname + '/uploads'));

const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log("listening to " + port);
});
