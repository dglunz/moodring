$(window).scroll(function() {
  if ($(".navbar").offset().top > 50) {
    $(".navbar-fixed-top").addClass("top-nav-collapse");
  } else {
    $(".navbar-fixed-top").removeClass("top-nav-collapse");
  }
});

$(function() {
  $('a.page-scroll').bind('click', function(event) {
    var $anchor = $(this);
    $('html, body').stop().animate({
      scrollTop: $($anchor.attr('href')).offset().top
    }, 1500, 'easeInOutExpo');
    event.preventDefault();
  });
});

$('.navbar-collapse ul li a').click(function() {
  $('.navbar-toggle:visible').click();
});

$(function() {
  $("body").on("input propertychange", ".github-repo", function(e) {
    var size = $(this).val().length;
    $(this).css('width', 65 + (size * 6));
    console.log(size);
  });
});

$(function() {
  $("body").on("input propertychange", ".floating-label", function(e) {
    $(this).toggleClass("floating-label-with-value", !! $(e.target).val());
  }).on("focus", ".floating-label", function() {
    $(this).addClass("floating-label-with-focus");
  }).on("blur", ".floating-label", function() {
    $(this).removeClass("floating-label-with-focus");
  });
});
