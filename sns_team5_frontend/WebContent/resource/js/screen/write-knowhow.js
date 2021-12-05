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
  $(function () {
    $("#summernote").summernote({
      height: 500,
      width: 800,
      toolbar: [
        ["style", ["style"]],
        ["font", ["bold", "italic", "underline", "clear"]],
        ["fontname", ["fontname"]],
        ["color", ["color"]],
        ["insert", ["picture"]],
        ["view", ["codeview"]],
      ],
      callbacks: {
        onImageUpload: function (files, editor, welEditable) {
          for (var i = files.length - 1; i >= 0; i--) {
            sendFile(files[i], this);
          }
        },
      },
    });
  });

  function sendFile(file, el) {
    var form_data = new FormData();
    form_data.append("file", file);
    $.ajax({
      data: form_data,
      type: "POST",
      xhrFields: { withCredentials: true },
      crossDomain: true,
      url: "http://localhost:3000/feed/uploadImage",
      cache: false,
      contentType: false,
      enctype: "multipart/form-data",
      processData: false,
      success: function (img_name) {
        alert("success");
        $(el).summernote("editor.insertImage", img_name);
      },
      error: function () {
        alert("error");
      },
    });
  }

  function handleImgFileSelect(e) {
    var files = e.target.files;
    var filesArr = Array.prototype.slice.call(files);

    filesArr.forEach(function (f) {
      sel_file = f;

      var reader = new FileReader();
      reader.onload = function (e) {
        $("#thumbnail-photo").html("");
        $("#thumbnail-photo").append(`
          <img src="${e.target.result}">
        `);
      };
      reader.readAsDataURL(f);
    });
  }

  $("#thumbnail-photo").click(() => {
    $("#thumbnail-input").click();
  });
  $("#thumbnail-input").on("change", handleImgFileSelect);

  $("#writefeedbtn").click(function () {
    let title = $("#write-knowhow_title").val();
    let content = $("#summernote").val();
    let hashtags = $(".write-hashtagItem");
    let userid = loggedInUser.seq;
    let hashtag = "";
    for (i = 0; i < hashtags.length; i++) {
      if (i !== 0) {
        hashtag += "-";
      }
      hashtag += hashtags[i].innerText;
    }
    let form_data = new FormData($("#write-knowhow_frm")[0]);
    form_data.append("title", title);
    form_data.append("userid", userid);
    form_data.append("hashtag", hashtag);
    form_data.append("groupno", groupno);
    form_data.append("content", content);
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
        location.href = `../sns/${loadedPage.split("-")[1]}.html`;
      },
      error: function () {
        alert("error");
      },
    });
  });

  $("#hashtag-input").keyup((e) => {
    e.preventDefault();
    if (e.keyCode === 13 && $("#hashtag-input").val().trim() !== "") {
      $("#write-hashtagList").append(`
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
