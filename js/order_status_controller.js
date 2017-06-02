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