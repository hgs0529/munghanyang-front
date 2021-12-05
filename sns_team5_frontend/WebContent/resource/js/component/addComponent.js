$(document).ready(() => {
  console.log("addcomp");

  $("#colorBox").load("../component/colorbox.html");
  $("#haeder").load("../component/header.html");
  $("#footer").load("../component/footer.html");
  if (loadedDir === "sns") {
    $("#navbar").load("../component/snsNav.html");
  } else if (loadedDir === "store") {
    $("#navbar").load("../component/storeNav.html");
  } else if (loadedDir === "user") {
    if (loadedPage === "userdetail") {
      $("#navbar").load("../component/userNav.html");
      $(".user-detail-card").load("../component/userdetail-card.html");
    }
  }
  if (loggedInUser) {
    console.log("chat loading");
    $(".floating-chat").load("../component/chat.html");
  } else {
    $(".floating-chat").css("display", "none");
  }

  console.log("addcomp 끝");
});
