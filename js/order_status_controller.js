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
});