/*jslint node: true */
'use strict';
var mongoose = require('mongoose');
var bcrypt = require("bcrypt-nodejs");
var SALT_FACTOR = 30;
var noop = function () {};

// company dragonistweb has the highest priviliege to control all other companies.
// For one company, only user in (Group: Admin) could assign tasks, add/remove users
// within its own company.
var userSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    company: {type: String, required: true},
    Group: {type: String, required: true},
    displayName: String,
    createdAt: {type: Date, default: Date.now}
});

userSchema.pre("save", function (done) {
    var user = this;
    if (!user.isModified("password")) {
        return done();
    }
    bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
        if (err) {
            return done(err);
        }
        bcrypt.hash(user.password, salt, noop, function (err, hashedPassword) {
            if (err) {
                return done(err);
            }
            user.password = hashedPassword;
            done();
        });
    });
});

// get display name or user name
userSchema.methods.getName = function () {
    return this.displayName || this.username;
};

userSchema.methods.checkPassword = function (guess, done) {
    bcrypt.compare(guess, this.password, function (err, isMatched) {
        done(err, isMatched);
    });
};

var User = mongoose.model("User", userSchema);
module.exports = User;
