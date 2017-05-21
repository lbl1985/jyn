// This jquery need lots of refactoring...
var renderExternalTmpl = function(item) {
    var file = 'C:/Experiment/javaScript/jyn/views_exp/templates/' + item.name + ".tmpl.html";
    $.when($.get(file))
        .done(function(templDate) {
            var tmpl = $.templates(templDate);
            if (item.name === "productRow") {
                if (item.selector === "#order_table") {
                    $(item.selector).append(tmpl.render(item.data));
                } else {
                    rendered_array = $(tmpl.render(item.data)).children();
                    $.each($(item.selector), function(i, v) {
                        $(v).html($(rendered_array[i]).html());
                    })
                }
            } else {
                $(item.selector).html(tmpl.render(item.data));
            }
        });
}

var addProductToOrderTable = function(currentRow) {
    var buttonStatus = $('#btnAdd').html();
    var product = $("#input_p").productToObject();
    product['p_totalPrice'] = product['p_price'] * product['p_quantity'];
    var selectorCase;
    if (buttonStatus === "ADD") {
        selectorCase = "#order_table";
    } else {
        selectorCase = currentRow;
    }
    var item = {name:"productRow", selector:selectorCase, data:product};
    renderExternalTmpl(item);
    $('#input_p input').each(function(){
        // $(this).removeAttr('value');
        $(this).val('');
    })
    $('[name="p_name"]').focus();
    if (buttonStatus === 'UPDATE') {
        $('#btnAdd').html('ADD');
    }
}

$(document).ready(function() {
    var currentRow = {};

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
        selected_item = $('#category_selector option:selected').text();
        if (selected_item === '产品'){
            addProductToOrderTable(currentRow);
        }
    });

    $('#order_table tbody').on('click', 'td', function(evt){
        evt.preventDefault();
        $($(evt.target).parent('tr')[0]).toggleClass('rowHighlight');
    });

    // $('#order_table tbody tr').click(function(evt){
    //     $(evt.target).closet('td').siblings().andSelf().toggleClass('rowHighLight');
    // });

    $('#order_table tbody').on('dblclick', 'td', function(evt) {
        evt.preventDefault();
        currentTr = $(evt.target).parents('tr');
        currentRow = currentTr.children();
        row_product = currentTr.productRowToObject();
        $.each($('#input_p input'), function(i, v){
            $(v).val(row_product[i])
        })
        $('#btnAdd').html('UPDATE');
        inputColumnName = $(evt.target).attr('class');
        inputColumnSelector = '[name="' + inputColumnName + '"]';
        $(inputColumnSelector).focus();
    })

    $('#order_table tbody').on('click', '.deleteRow', function(evt) {
        evt.preventDefault();
        $(evt.target).parents('tr').remove();
    });

    // $('#order_table tbody').on('click', '.editRow', function(evt) {
    //     evt.preventDefault();
    //     currentTr = $(evt.target).parents('tr');
    //     currentRow = currentTr.children();
    //     row_product = currentTr.productRowToObject();
    //     $.each($('#input_p input'), function(i, v){
    //         $(v).val(row_product[i])
    //     })
    //     $('#btnAdd').html('UPDATE');
    //     $('[name="p_name"]').focus();
    // })

    var itemId = 0;
    (function($){
        $.fn.extend({
            toObject:function() {
                console.log(this.serialize());
            },
            productRowToObject:function() {
                var arr = []
                $.each($(this).children().slice(1, -3), function(i, v){
                    arr.push($(v).html());
                })
                arr.push($($(this).children().slice(7, -1)).html());
                return arr;
            },
            productToObject:function(){
                var obj = {}
                $.each($(this).children().serializeArray(), function(i, v){
                    obj[v.name] = v.value;
                })
                return obj;
            }
        });
    })(jQuery);

});