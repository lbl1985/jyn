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
                '<select class="form-control" id="status_selector" name="status"> <option value="Open">创建</option> <option value="Paid">收到付款</option> <option value="Production">生产中</option> <option value="Shipping">运输中</option> <option value="Arrived">到达</option> <option value="Close">结束</option> </select>'
            );
        } else if ($(evt.target).attr('class') === 'td_assign_to') {
            console.log('user wants to change assign to');
        }
    });

    $('.editOrder').on('click', function(evt) {
        evt.preventDefault();
        var uuid = $($(evt.target).parent().parent().siblings('.uuid')).text();
        var assign_to = "haha100";
        var assign_by = $('#username').text();
        var dt = new Date();

        $.ajax({
            type: "POST",
            url: "/order_status",
            data: JSON.stringify({orderUUID: uuid, assign_to: assign_to, assign_by: assign_by, dt: dt}),
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