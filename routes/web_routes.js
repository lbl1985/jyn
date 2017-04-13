/*jslint node: true */
"use strict";
var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

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

router.get("/users", function (req, res, next) {
    req = req;
    User.find()
        .sort({createdAt: "descending"})
        .exec(function (err, users) {
            if (err) {
                return next(err);
            }
            res.render("users", {users: users, options: req.app.locals});
        });
});

router.get("/signup", function (req, res) {
    res.render("signup", {options: req.app.locals});
});

router.post("/signup", function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var company = req.body.company;
    var Group = req.body.Group;

    User.findOne({username: username}, function (err, user) {
        if (err) {
            return next(err);
        }
        if (user) {
            req.flash("error", "User already exists");
            return res.redirect("/signup");
        }
        var newUser = new User({
            username: username,
            password: password,
            company: company,
            Group: Group
        });
        newUser.save();
        return res.redirect("/users");
    })
})

module.exports = router;