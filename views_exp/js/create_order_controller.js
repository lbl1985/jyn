//<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

$(document).ready(function() {
    $('#category_selector').change(function(evt){
        evt.preventDefault();
        selected_item = $('#category_selector option:selected').text();
        $('#input_title').hide();
        $("#input_p").hide();
        $('#input_address').hide();
        $('#input_note').hide();
        
        if(selected_item === '标题') {
            $('#input_title').show();
        }
        if(selected_item === '产品') {
            $('#input_p').show();
        }
        if(selected_item ==='地址') {
            $('#input_address').show();
        }
        if(selected_item === "备注") {
            $('#input_note').show();
        }
    });
});