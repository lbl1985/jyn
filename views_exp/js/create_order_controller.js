var renderExternalTmpl = function(item) {
    var file = 'C:/Experiment/javaScript/jyn/views_exp/templates/' + item.name + ".tmpl.html";
    $.when($.get(file))
        .done(function(templDate) {
            var tmpl = $.templates(templDate);
            if (item.selector === "#order_table" && item.name === "productRow") {
                $(item.selector).append(tmpl.render(item.data));
            } else {
                $(item.selector).html(tmpl.render(item.data));
            }
        });
}

$(document).ready(function() {
    $(['required="required"']).prev('label').append('<span>*</span>').children('span').addClass('required');

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
        if(selected_item === "订单备注") {
            $('#input_note').show();
        }
    });

    $('#btnAdd').click(function(evt) {
        evt.preventDefault();
        var product = $("#input_p").productToObject();
        product['p_totalPrice'] = product['p_price'] * product['p_quantity'];
        var item = {name:"productRow", selector:"#order_table", data:product};
        renderExternalTmpl(item);
        $('#input_p input').each(function(){
            // $(this).removeAttr('value');
            $(this).val('');
        })
    });

    $('#order_table tbody').on('click', '.deleteRow', function(evt) {
        evt.preventDefault();
        $(evt.target).parents('tr').remove();
    });

    var itemId = 0;
    (function($){
        $.fn.extend({
            toObject:function() {
                console.log(this.serialize());
            },
            productToObject:function(){
                obj = {}
                $.each($(this).children().serializeArray(), function(i, v){
                    obj[v.name] = v.value;
                })
                return obj;
            }
        });
    })(jQuery);

    
});