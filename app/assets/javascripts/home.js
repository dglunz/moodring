$(function() {
  $("body").on("input propertychange", ".github-repo", function(e) {
    var size = $(this).val().length;
    $(this).css('width', 65 + (size * 6));
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


