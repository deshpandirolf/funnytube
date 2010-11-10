jQuery(document).ready(function() {
    var params = { allowScriptAccess: "always", bgcolor: "#cccccc" };
    var atts = { id: "ytplayer" };
    swfobject.embedSWF("http://www.youtube.com/apiplayer?enablejsapi=1&playerapiid=ytplayer",
                       "ytapiplayer", "480", "360", "8",
                       null, null, params, atts);

    jQuery("input#v").focus();

    jQuery("div.vid").hover(function() {
        jQuery(this).children("h2").show();
        jQuery(this).children("a").children(".play-img").css({"opacity": "0.8"});
    }, function () {
        jQuery(this).children("h2").hide();
        jQuery(this).children("a").children(".play-img").css({"opacity": "0.4"});
    });

    jQuery("a.play-link").click(function() {
        var vid_id = jQuery(this).attr("rel");
        var title = jQuery(this).prev().html();

        jQuery("body").append('<div id="fade"></div>');
        jQuery("#vt").html(title);
        jQuery("#player").css({"visibility": "visible"});
        jQuery("#fade").css({"filter" : "alpha(opacity=80)"}).fadeIn();
        ytplayer.cueVideoById(vid_id, 0);
        ytplayer.playVideo();

        return false;
    });

    jQuery("#overlay").live("click", function() {
        if (ytplayer.getPlayerState() == 1) { // playing
            ytplayer.pauseVideo();
        } else {
            ytplayer.playVideo();
        }
        return false;
    });

    jQuery("#fade, #player").live("click", function() {
        ytplayer.pauseVideo();
        jQuery("#player").css({"visibility": "hidden"});
        jQuery("#fade").hide(0, function() {
            jQuery("#fade").remove();
        });
        return false;
    });
});

function onYouTubePlayerReady() {
    ytplayer = document.getElementById("ytplayer");
}
