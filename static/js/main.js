jQuery(document).ready(function() {
    var params = { allowScriptAccess: "always", bgcolor: "#cccccc" };
    var atts = { id: "ytplayer" };
    swfobject.embedSWF("http://www.youtube.com/apiplayer?enablejsapi=1&playerapiid=ytplayer",
                       "ytapiplayer", "480", "360", "8",
                       null, null, params, atts);

    jQuery("input#v").focus();

    jQuery("div.vid").hover(function() {
        jQuery(this).children("h2").show();
        jQuery(this).children("a").children(".play-img").css({"opacity": "1.0"});
    }, function () {
        jQuery(this).children("h2").hide();
        jQuery(this).children("a").children(".play-img").css({"opacity": "0.6"});
    });

    jQuery("a.play-link").click(function() {
        var vid_id = jQuery(this).attr("rel");

        jQuery("body").append('<div id="fade"></div>');
        jQuery("#player").css({"visibility": "visible"});
        jQuery("#fade").css({"filter" : "alpha(opacity=80)"}).fadeIn();
        ytplayer.cueVideoById(vid_id, 0);
        ytplayer.playVideo();

        return false;
    });

    jQuery('#fade').live('click', function() {
        ytplayer.stopVideo();
        jQuery("#player").css({"visibility": "hidden"});
        jQuery("#fade").hide(0, function() {
            jQuery('#fade').remove();
        });
        return false;
    });
});

function onYouTubePlayerReady() {
    ytplayer = document.getElementById("ytplayer");
}
