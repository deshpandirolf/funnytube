jQuery(document).ready(function() {
    jQuery("input#v").focus();

    jQuery("div.vid").hover(function() {
        jQuery(this).children("h2").css({}).fadeIn();
    }, function () {
        jQuery(this).children("h2").fadeOut();
    });

    jQuery("a.play-link").click(function() {
        var vid_id = jQuery(this).attr("rel");

        alert(vid_id);
    });

/*        jQuery("#" + modal + " h2").append('<span class="close">[<a href="#">X</a>]</span>');
        jQuery("#" + modal).show();

        var popMargTop = (jQuery("#" + modal).height()) / 2;
        var popMargLeft = (jQuery("#" + modal).width()) / 2;
        jQuery("#" + modal).css({
            "margin-top" : -popMargTop,
            "margin-left" : -popMargLeft
        });

        jQuery("body").append('<div id="fade"></div>');
        jQuery("#fade").css({"filter" : "alpha(opacity=80)"}).fadeIn();

        return false;
    });

    jQuery('span.close a, #fade').live('click', function() {
        jQuery('#fade , .modal').hide(0, function() {
            jQuery('#fade, span.close').remove();
        });
        return false;*/
});
