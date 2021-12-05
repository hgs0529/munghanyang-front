$(document).ready(() => {
  $(".moveTop").html(`<i class="fas fa-chevron-up"></i>TOP`);

  let btn = $(".moveTop");
  $(window).scroll(function () {
    if ($(window).scrollTop() > 300) {
      btn.addClass("show");
    } else {
      btn.removeClass("show");
    }
  });

  btn.on("click", function (e) {
    e.preventDefault();
    $("html, body").animate({ scrollTop: 0 }, "300");
  });
});
