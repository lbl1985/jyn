/*jslint node: true */
'use strict';
var mongoose = require('mongoose');

var productSchema = mongoose.Schema({
    productName: {type: String, required: true},
    model: {type: String},
    quantity: {type: Number, required: true},
    unit: {type: String},
    unit_price: {type: Number, required: true},
    price: {type: Number, required: true},
    note: {type: String}
});

var orderStatus = mongoose.Schema({
    // status includes: 
    // Created, payment_received, manufacture, shipping, shipped, closed
    current_status: {type: String},
    create_date: {type: Date, default: Date.now},
    create_by: {type: String},
    assign_to: {type: String},
    assign_by: {type: String},
    assign_date: {type: Date},
    ship_by: {type: String},
    ship_date: {type: Date},
    close_by: {type: String},
    close_date: {type: String}
});

var contactInfo = mongoose.Schema({
    name: {type: String, required: true},
    cell_phone: {type: String},
    wechat: {type: String}
});

var orderSchema = mongoose.Schema({
    uuid: {type: String, required: true, unique: true},
    title: {type: String, required: true},
    product: {type: [productSchema], required: true},
    ship_add: {type: String, required: true},
    company: {type: String},
    expect_ship_date: {type: Date},
    status: {type: orderStatus},
    ship_receipt: {type: mongoose.Schema.Types.Mixed},
    contact: {type: contactInfo}
});

var Order = mongoose.model("Order", orderSchema);
module.exports = Order;