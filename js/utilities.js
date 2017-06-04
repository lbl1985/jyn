var getCurrentTimeString = function() {
    'use strict';
    var d = new Date();
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
};

var updateOrderStatus = function(target) {
    'use strict';
    var status_map = {
        "Open": "创建",
        "Paid": "收到付款",
        "Production": "生产中",
        "Shipping": "运输中",
        "Arrived": "到达",
        "Close": "结束"
    }
    var obj = {};
    var users = [];
    var td = $(target.parent().parent());
    obj.orderUUID = $(td.siblings('.uuid')).text();
    // if td_status has children, it is selection mode
    var td_status = $(td.sibling)
    if ($(td.siblings('.td_status')).children().length) {
        obj.status = $($(td.siblings('.td_status')).children()[0]).val();
        obj.status = status_map[obj.status];
    } else {
        obj.status = $(td.sibling('.td_status')).text();
    }
    obj.assign_to = $(td.siblings('.td_assign_to')).text();
    obj.dt = new Date();
    return obj;
}

var createOptions = function(vals, texts) {
    var str = '';
    str += '<select class="form-control"> ';
    vals.array.forEach(function(val, index) {
        str += '<option value="' + val + '">' + texts[index] + '</option> ';
    });

};