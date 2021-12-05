$(document).ready(() => {
  const url = new URL(location.href);
  const urlParams = url.searchParams;
  const content = urlParams.get("content");
  console.log(content);

  console.log(loadedPage.split("-")[0]);
  console.log(loadedPage.split("-")[1]);
  if (loadedDir === "sns") {
    if (loadedPage.split("-")[0] === "write") {
      $("#sns-nav_" + loadedPage.split("-")[1]).css("color", "#fcce00");
      $("#sns-navlist_" + loadedPage.split("-")[1]).css(
        "border-color",
        "#fcce00"
      );
    } else {
      $("#sns-nav_" + loadedPage).css("color", "#fcce00");
      $("#sns-navlist_" + loadedPage).css("border-color", "#fcce00");
    }
  } else if (loadedDir === "store") {
    if (content) {
      $("#store-nav_" + content).css("color", "#fcce00");
      $("#store-navlist_" + content).css("border-color", "#fcce00");
    } else if (loadedPage === "main") {
      $("#store-nav_main").css("color", "#fcce00");
      $("#store-navlist_main").css("border-color", "#fcce00");
    }
  } else if (loadedDir === "user") {
  }
});
