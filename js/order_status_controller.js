$(document).ready(function() {
    $('.deleteOrder').on('click', function(evt) {
        evt.preventDefault();
        var uuid =$($(evt.target).parent().parent().siblings('.uuid')).text();
        $.ajax({
            type: "DELETE",
            url: "/order_status",
            data: JSON.stringify({orderUUID: uuid}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                window.location.reload(true);
            },
            error: function (errMsg) {
                alert('error with deleting');
            }
        });
    });

    $('#order_status tbody').on('dblclick', 'td', function(evt) {
        evt.preventDefault();
        if ($(evt.target).attr('class') === 'td_status') {
            $(evt.target).html(
                '<select class="form-control"> <option value="Open">创建</option> <option value="Paid">收到付款</option> <option value="Production">生产中</option> <option value="Shipping">运输中</option> <option value="Arrived">到达</option> <option value="Close">结束</option> </select>'
            );
        } else if ($(evt.target).attr('class') === 'td_assign_to') {
            console.log('user wants to change assign to');
        }
    });

    $('.editOrder').on('click', function(evt) {
        evt.preventDefault();
        var obj = updateOrderStatus($(evt.target));

        $.ajax({
            type: "POST",
            url: "/order_status",
            data: JSON.stringify(obj),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                window.location.reload(true);
            },
            error: function (errMsg) {
                alert('error with deleting');
            }
        })
    })
});