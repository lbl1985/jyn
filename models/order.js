/*jslint node: true */
'use strict';
var mongoose = require('mongoose');

var productSchema = mongoose.Schema({
    itemId: {type: Number, required: true},
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
    // 创建, 收到付款, 生产中, 运输中, 到达, 结束
    status: {type: String},
    date: {type: [Date]},
    create_date: {type: Date, default: Date.now},
    create_by: {type: String},
    assign_to: {type: [String]},
    assign_by: {type: [String]},
    ship_by: {type: String},
    ship_date: {type: Date},
    close_by: {type: String},
    close_date: {type: Date}
});

var contactInfo = mongoose.Schema({
    name: {type: String, required: true},
    cell_phone: {type: String},
    wechat: {type: String}
});

var orderSchema = mongoose.Schema({
    uuid: {type: String, required: true, unique: true},
    title: {type: String, required: true},
    products: {type: [productSchema], required: true},
    ship_add: {type: String, required: true},
    company: {type: String},
    company_src: {type: String}, // provider company
    expect_ship_date: {type: Date},
    status: {type: orderStatus},
    ship_receipt: {type: mongoose.Schema.Types.Mixed},
    contact: {type: contactInfo},
    note: {type: String}
});

var Order = mongoose.model("Order", orderSchema);
module.exports = Order;