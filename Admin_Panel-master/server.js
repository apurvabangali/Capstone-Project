const express = require("express");
const app = express();
const path = require('path');
const hbs = require('hbs');
const cors = require("cors");
require("dotenv").config();
const port = process.env.port
const cookieParser = require("cookie-parser");
require("./src/db/conn");

const session = require('express-session')
app.use(session({
    secret: 'session secret',
    resave: false,
    saveUninitialized: false,
  }));
app.use((req, res, next) => {
    res.locals.message = req.session.message
    delete req.session.message
    next()
  })


app.set('views', path.join(__dirname, '/src/views'));
app.set('view engine', 'hbs');

app.use(express.static(__dirname + '/src/public'));
// console.log( path.join(__dirname, './src/public'));//
hbs.registerPartials(path.join(__dirname + "/src/views/partials"));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//in entry point of your app (index.js)//
const routes = require('./src/routes/admin.route');
app.use("/", routes)


app.listen(port, () => {
    console.log(`Your Project Is Running On Port ${port} `);
    console.log("http://localhost:8080/");
});