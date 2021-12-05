$(document).ready(() => {
  let groupno;
  if (loadedPage.split("-")[1] === "knowhow") {
    groupno = 1;
  } else if (loadedPage.split("-")[1] === "review") {
    groupno = 2;
  } else if (loadedPage.split("-")[1] === "bbs") {
    groupno = 3;
  } else {
    groupno = 4;
  }
  $(".moveTop").remove();
  console.log(groupno);
  function handleImgFileSelect(e) {
    var files = e.target.files;
    var filesArr = Array.prototype.slice.call(files);

    $("#write-photo-slider").off("click");
    $("#write-photo-slider").css("cursor", "default");

    $("#write-photo-slider").html("");
    $("#write-photo-slider").append(`
      ${
        filesArr.length > 1
          ? '<a href="#" class="control_next">></a><a href="#" class="control_prev"><</a>'
          : ""
      }
      <ul class="write-photo-slider_item"></ul>
    `);

    filesArr.forEach(function (f) {
      sel_file = f;

      var reader = new FileReader();
      reader.onload = function (e) {
        $(".write-photo-slider_item").append(`
          <li><img src="${e.target.result}"></li>
        `);
      };
      reader.readAsDataURL(f);
    });

    var slideCount = $("#write-photo-slider ul li").length;
    var slideWidth = $("#write-photo-slider ul li").width();
    var slideHeight = $("#write-photo-slider ul li").height();
    var sliderUlWidth = slideCount * slideWidth;

    $("#write-photo-slider").css({
      width: slideWidth,
      height: slideHeight,
    });

    $("#write-photo-slider ul").css({
      width: sliderUlWidth,
      marginLeft: -slideWidth,
    });

    $("#write-photo-slider ul li:last-child").prependTo(
      "#write-photo-slider ul"
    );

    function moveLeft() {
      $("#write-photo-slider ul").animate(
        {
          left: +slideWidth,
        },
        200,
        function () {
          $("#write-photo-slider ul li:last-child").prependTo(
            "#write-photo-slider ul"
          );
          $("#write-photo-slider ul").css("left", "");
        }
      );
    }

    function moveRight() {
      $("#write-photo-slider ul").animate(
        {
          left: -slideWidth,
        },
        200,
        function () {
          $("#write-photo-slider ul li:first-child").appendTo(
            "#write-photo-slider ul"
          );
          $("#write-photo-slider ul").css("left", "");
        }
      );
    }

    $("a.control_prev").click(function () {
      moveLeft();
    });

    $("a.control_next").click(function () {
      moveRight();
    });
  }

  $("#write-photo-slider").on("click", () => {
    $("#photo-upload-input").click();
  });
  $("#photo-upload-input").on("change", handleImgFileSelect);

  $("#writefeedbtn").click(function () {
    let hashtags = $(".write-hashtagItem");
    let userid = loggedInUser.seq;
    let hashtag = "";
    for (i = 0; i < hashtags.length; i++) {
      if (i !== 0) {
        hashtag += "-";
      }
      hashtag += hashtags[i].innerText;
    }
    let form_data = new FormData($("#write-photo_main")[0]);
    form_data.append("userid", userid);
    form_data.append("hashtag", hashtag);
    form_data.append("groupno", groupno);
    $.ajax({
      url: "http://localhost:3000/feed/addpictureboard",
      type: "post",
      xhrFields: { withCredentials: true },
      crossDomain: true,
      cache: false,
      contentType: false,
      enctype: "multipart/form-data",
      processData: false,
      data: form_data,
      success: function (str) {
        if (str === "YES") {
          alert("글 작성 성공");
        } else {
          alert("글 작성 실패");
        }
        location.href = "../sns/main.html";
      },
      error: function () {
        alert("error");
      },
    });
  });

  $("#hashtag-input").keyup((e) => {
    e.preventDefault();
    if (e.keyCode === 13 && $("#hashtag-input").val().trim() !== "") {
      $("#write-photo-hashtags-hashtagList").append(`
        <div class="write-hashtagItem">#${$("#hashtag-input")
          .val()
          .trim()}<i class="fas fa-times cancelHashtage"></i></div>
      `);
      $(".cancelHashtage")
        .last()
        .click(function () {
          this.parentNode.remove();
        });
      $("#hashtag-input").val("");
      $("#hashtag-input").focus();
    }
  });
});
