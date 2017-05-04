/*jslint node: true */
'use strict';
var express = require('express');
var mongoose = require("mongoose");
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require("express-flash");
var passport = require("passport");
var setUpPassport = require("./auth/setuppassport_local");

var routes = require('./routes/web_routes');

var app = express();
app.locals.appName = "青岛捷怡纳包裹管理系统";
// app.locals.currentUser = "Binlong Li";

mongoose.connect("mongodb://localhost:27017/packCtrl_jyn");
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("mongoose connect to mongo db");
});

setUpPassport();

app.set("port", process.env.PORT || 3000);
app.set("view engine", "pug");
app.set("views", path.resolve(__dirname, "views"));

app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    secret: require('crypto').randomBytes(64).toString('hex'),
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
app.use(express.static(path.join(__dirname)));

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.listen(app.get("port"), function () {
    console.log("Server started on port " + app.get("port"));
});


