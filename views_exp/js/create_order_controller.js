var renderExternalTmpl = function(item) {
    var file = 'C:/Experiment/javaScript/jyn/views_exp/templates/' + item.name + ".tmpl.html";
    $.when($.get(file))
        .done(function(templDate) {
            var tmpl = $.templates(templDate);
            $(item.selector).html(tmpl.render(item.data));
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
        if(selected_item === "备注") {
            $('#input_note').show();
            var item = {name:"template_test", selector:"#testTemplate", data:{name:"Binlong_Minjie"}};
            renderExternalTmpl(item);
        }

    });

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