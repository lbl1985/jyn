$(document).ready(function() {
    $('.deleteOrder').on('click', function(evt) {
        evt.preventDefault();
        uuid =$($(evt.target).parentsUntil('tbody').slice(-1).children()[0]).text();
        
    });
});