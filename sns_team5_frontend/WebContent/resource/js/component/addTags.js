$(document).ready(() => {
  console.log("addtag");
  $("body").prepend(`<div class="navbar-container" id="navbar"></div>`);
  $("body").prepend(`<div class="header-container" id="haeder"></div>`);
  $("body").prepend(`<div class="colorBox" id="colorBox"></div>`);

  $(`<div class="floating-chat"></div>`).insertAfter($(".content-container"));
  if (loggedInUser) {
    $(`<div class="writeFeed"></div>`).insertAfter($(".content-container"));
  }
  $(`<div class="moveTop"></div>`).insertAfter($(".content-container"));

  $(`<div class="footer-container" id="footer"></div>`).insertAfter(
    $(".content-container")
  );
  console.log("addtag 끝");
});
