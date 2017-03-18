"use strict";
var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
    req = req;
    res.render("index");
});

router.get("/about", function (req, res) {
    req = req;
    res.render("about");
});

module.exports = router;