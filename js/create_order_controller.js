// This jquery need lots of refactoring...
var renderExternalTmpl = function (item) {
    'use strict';
    var file = '/templates/' + item.name + ".tmpl.html";
    $.when($.get(file))
        .done(function (templDate) {
            var tmpl = $.templates(templDate);
            if (item.name === "productRow") {
                if (item.selector === "#order_table") {
                    $(item.selector).append(tmpl.render(item.data));
                } else {
                    var rendered_array = $(tmpl.render(item.data)).children();
                    $.each($(item.selector), function(i, v) {
                        $(v).html($(rendered_array[i]).html());
                    })
                }
            } else {
                $(item.selector).html(tmpl.render(item.data));
            }
        });
};

var addProductToOrderTable = function(currentRow) {
    var buttonStatus = $('#btnAdd').html();
    var product = $("#input_p").productToObject();
    product['p_totalPrice'] = product['p_price'] * product['p_quantity'];
    var selectorCase;
    if (buttonStatus === "ADD") {
        product['p_itemId'] = $('#order_table tr').length;
        selectorCase = "#order_table";
    } else {
        // update will keep the itemId unchanged.
        product['p_itemId'] = $(currentRow[0]).text();
        selectorCase = currentRow;
    }
    var item = {name:"productRow", selector:selectorCase, data:product};
    renderExternalTmpl(item);
    $('#input_p input').each(function(){
        $(this).val('');
    })
    $('[name="p_name"]').focus();
    if (buttonStatus === 'UPDATE') {
        $('#btnAdd').html('ADD');
    } 
}

var addOrderTitle = function(t) {
    $('#order_' + t).text($('[name="input_' + t + '"]').val());
    var buttonStatus = $('#btnAdd').html();
    if (buttonStatus === 'ADD') {
        if (t === 'title') {
            $('#category_selector option:selected').text('产品');
            $('#category_selector').change();
            $('[name="p_name"]').focus();
        } else if (t === 'address') {
            $('#category_selector option:selected').text('订单备注');
            $('#category_selector').change();
            $('div[name="input_note"]').focus();
        }
    }
}

var getGuid = function guid() {
    'use strict';
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
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
        } else if (selected_item === '标题') {
            addOrderTitle('title');
        } else if (selected_item === '地址') {
            addOrderTitle('address');
        } else if (selected_item === '订单备注') {
            addOrderTitle('note');
        }
    });

    $('#btnSubmit').click(function(evt) {
        evt.preventDefault();
        var order = {};
        order.uuid = getGuid();
        order.title = $('#order_title').text();
        order.ship_add = $('#order_address').text();
        order.note = $('#order_note').text();
        var products = [];
        $.each($('#order_table tbody tr'), function (i, v) {
            products.push( $(v).productRowToObject());
        });
        order.products = products;
        $.ajax({
            type: "POST",
            url: "/create_order",
            data: JSON.stringify({order: order}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                alert('Data saved successfully');
            },
            error: function (errMsg) {
                alert(errMsg.responseText);
            }
        });
    });

    $('#order_title').on('dblclick', function (evt) {
        evt.preventDefault();
        $('#category_selector option:selected').text('标题');
        $('#category_selector').change();
        $('#input_title').focus();
        $('#btnAdd').html('UPDATE');
    });

    $('#order_address').on('dblclick', function(evt){
        evt.preventDefault();
        $('#category_selector option:selected').text('地址');
        $('#category_selector').change();
        $('#input_address').focus();
        $('#btnAdd').html('UPDATE');
    });

    $('#order_note').on('dblclick', function(evt){
        evt.preventDefault();
        $('#category_selector option:selected').text('订单备注');
        $('#category_selector').change();
        $('#input_note').focus();
        $('#btnAdd').html('UPDATE');
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
        row_product = currentTr.productRowToArray();

        $('#category_selector option:selected').text('产品');
        $('#category_selector').change();
        
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
        // update the product id number
        $.each($('#order_table tbody td.p_itemId'), function(i, v) {
            $(v).text(i+1)
        });
    });

    var itemId = 0;
    (function($){
        $.fn.extend({
            toObject:function() {
                console.log(this.serialize());
            },
            productRowToArray:function() {
                var arr = []
                $.each($(this).children().slice(1, -3), function(i, v){
                    arr.push($(v).html());
                })
                arr.push($($(this).children().slice(7, -1)).html());
                return arr;
            },
            productRowToObject:function() {
                var obj = {}
                $.each($(this).children(), function(i, v){
                    switch ($(v).attr('class')) {
                        case 'p_itemId':
                            obj['itemId'] = $(v).text();
                            break;
                        case 'p_name':
                            obj['productName'] = $(v).text();
                            break;
                        case 'p_model':
                            obj['model'] = $(v).text();
                            break;
                        case 'p_quantity':
                            obj['quantity'] = $(v).text();
                            break;
                        case 'p_unit':
                            obj['unit'] = $(v).text();
                            break;
                        case 'p_price':
                            obj['unit_price'] = $(v).text();
                            break;
                        case 'p_totalPrice':
                            obj['price'] = $(v).text();
                            break;
                        case 'p_note':
                            obj['note'] = $(v).text();
                            break;
                    }
                });
                return obj;
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