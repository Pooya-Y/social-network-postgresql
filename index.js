const express = require("express");
const { Pool, Client } = require('pg');
const users = require("./routes/users");
const posts = require("./routes/posts");

const app = express();

const cors = require("cors");
require('dotenv/config');

app.use(cors());
app.options("*", cors);
app.use(express.json());


app.use("/api/users", users);
app.use("/api/posts", posts);

app.use('/uploads', express.static(__dirname + '/uploads'));

const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log("listening to " + port);
});
