/*jslint node: true */
"use strict";
var express = require("express");
var router = express.Router();
var passport = require("passport");

router.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.errors = req.flash("error");
    res.locals.info = req.flash("info");
    next();
});

router.get("/", function (req, res) {
    req = req;
    res.render("index", {options: req.app.locals});
});

router.get("/about", function (req, res) {
    req = req;
    res.render("about", {options: req.app.locals});
});

module.exports = router;