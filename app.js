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
mongoose.connect("mongodb://localhost:27017/packCtrl");
setUpPassport();

app.locals.appName = "Qingdao Jieyina Package Management System";

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

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.listen(app.get("port"), function () {
    console.log("Server started on port " + app.get("port"));
});


