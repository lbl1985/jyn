/*jslint node: true */
"use strict";
var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var Order = require("../models/order");

router.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    if (req.user) {
        req.app.locals.currentUser = req.user.username;
    } else {
        req.app.locals.currentUser = "";
    }
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
        return res.redirect("/");
    });
});

router.get("/login", function (req, res, next) {
    res.render("login", {options: req.app.locals});
});

router.post("/login", passport.authenticate('local', {
    successRedirect: "/order_status",
    failureRedirect: "/login"
}));

router.get("/logout", function (req, res) {
    req.logOut();
    res.redirect("/");
})



function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated() && req.app.locals.currentUser === req.user.username) {
        next();
    } else {
        res.redirect("/login");
    }
}

router.get("/users", ensureAuthenticated, function (req, res, next) {
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

router.get("/users_array", ensureAuthenticated, function(req, res, next) {
    User.find()
        .sore({createdAt: "ascending"})
        .exec(function (err, users) {
            if(err) {
                return next(err);
            }
            var arr = []
            users.forEach(function(user) {
                arr.push(user.getName());
            });
            res.send({users:arr});
        });
});

router.get("/users/:username/profile", ensureAuthenticated, function (req, res, next) {
    User.findOne({username: req.params.username}, function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return next(404);
        }
        res.render("profile", {user: user, options: req.app.locals});
    })
})

router.get("/create_order", ensureAuthenticated, function (req, res) {
    res.render("create_order", {options: req.app.locals});
});

router.post("/create_order", ensureAuthenticated, function (req, response, next) {
    var order = req.body.order;
    var newOrder = new Order({
        uuid: order.uuid,
        title: order.title,
        products: order.products,
        ship_add: order.ship_add,
        company: "Other Company",
        company_src: "QD Jieyina",
        status: order.status,
        note: order.note
    });
    newOrder.save(function (err, res){
        if (err) {
            response.status(500);
            var messages = []
            messages.push(err.message);

            var keys = Object.keys(err.errors);
            for (var k in keys) {
                messages.push(err.errors[keys[k]].message);
            }
            messages = messages.join('\n');
            return response.send(messages);
        } else {
            // response.status(200);
            // response.redirect('/order_status');
            return response.send({status: 'Success'});
        }
    });
});

router.get("/order_status", ensureAuthenticated, function(req, res) {
    req = req;
    Order.find()
        // .sort({createdAt: "descending"})
        .exec(function(err, orders) {
            if(err) {
                return next(err);
            }
            res.render("order_status", {orders:orders, options: req.app.locals});
        });
});

router.delete("/order_status", ensureAuthenticated, function(req, res) {
    var orderUUID = req.body.orderUUID;
    Order.find({uuid: req.body.orderUUID}, function(err, order) {
        if(err) {
            return next(err);
        }
        if(order) {
            if (order.length > 0 && (order[0].uuid === orderUUID)) {
                order[0].remove({uuid: req.body.orderUUID});
                res.status(200);
            }
            return res.send({status: 'Success'});
        }
    });
});

router.post("/order_status", ensureAuthenticated, function(req, res, next) {
    var orderUUID = req.body.orderUUID;
    Order.find({uuid: req.body.orderUUID}, function(err, order) {
        if(err) {
            return next(err);
        }
        if(order) {
            if(order.length > 0 && (order[0].uuid === orderUUID)) {
                var dt = Date();
                order[0].status.assign_to = req.body.assign_to;
                order[0].status.status = req.body.status;
                order[0].status.assign_by = req.body.assign_by;
                order[0].status.date = order[0].status.date.push(req.body.dt);
                order[0].save(function(err, updatedOrder) {
                    if(err) next(err);
                    return res.send({status: "Success"});
                });
            }
        }

    })
})

module.exports = router;