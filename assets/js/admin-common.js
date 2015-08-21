//ICON
$(function () {
    var all_classes = "";
    var timer = undefined;
    $.each($('li', '.social-class'), function (index, element) {
        all_classes += " btn-" + $(element).data("code");
    });
    $('li', '.social-class').mouseenter(function () {
        var icon_name = $(this).data("code");
        if ($(this).data("icon")) {
            icon_name = $(this).data("icon");
        }
        var icon = "<i class='fa fa-" + icon_name + "'></i>";
        $('.btn-social', '.social-sizes').html(icon + "Sign in with " + $(this).data("name"));
        $('.btn-social-icon', '.social-sizes').html(icon);
        $('.btn', '.social-sizes').removeClass(all_classes);
        $('.btn', '.social-sizes').addClass("btn-" + $(this).data('code'));
    });
    $($('li', '.social-class')[Math.floor($('li', '.social-class').length * Math.random())]).mouseenter();
});


//CustomScrollbar
(function ($) {
    $(window).load(function () {
        $(".content").mCustomScrollbar();
    });
})(jQuery);


//edit Article , show hide media by duongtd2

$(document).ready(function (){
    $("#div-hide-video").hide();
    $("#div-hide-audio").hide();
    $("#div-hide-img").hide();
    // when user click edit hidden form will show
    $("#editVideo").click(function () {
        $("#div-hide-video").show();
        $("#div-show-video").hide();
    });
    $("#editAudio").click(function () {
        $("#div-hide-audio").show();
        $("#div-show-audio").hide();
    });
    $("#editImg").click(function () {
        $("#div-hide-img").show();
        $("#div-show-img").hide();
    });
    //when file selected , value of hidden textbox will change
    $("#file-edit-img").change(function(){
        $('#hid-img').val("yes");
    });
    $("#file-edit-video").change(function(){
        $('#hid-video').val("yes");
    });
    $("#file-edit-audio").change(function(){
        $('#hid-audio').val("yes");
    });
    // when user click cancle , status will back
    $("#cancleVideo").click(function () {
        $("#div-hide-video").hide();
        $("#div-show-video").show();
        $("#hid-video").val("no");
    });
    $("#cancleAudio").click(function () {
        $("#div-hide-audio").hide();
        $("#div-show-audio").show();
        $("#hid-audio").val("no");
    });
    $("#cancleImg").click(function () {
        $("#div-hide-img").hide();
        $("#div-show-img").show();
        $("#hid-img").val("no");
    });

    //edit question
    $("#div-hide-que-img").hide();
    $("#editImgQue").click(function (){
        $("#div-hide-que-img").show();
        $("#div-show-que-img").hide();
    });
    //when file selected , value of hidden textbox will change
    $("#file-edit-que-img").change(function(){
        $('#hid-imgQue').val("yes");
    });
    // when user click cancle , status will back
    $("#cancleImgQue").click(function () {
        $("#div-hide-que-img").hide();
        $("#div-show-que-img").show();
        $("#hid-imgQue").val("no");
    });
});