$(document).ready(() => {
  let nickChange = true;
  if (!loggedInUser) {
    location.href = "../sns/main.html";
  }
  let profilePhoto;
  if (loggedInUser.avatar) {
    profilePhoto = `
      <img src="${loggedInUser.avatar}">
    `;
  } else {
    profilePhoto = `
      <i class="far fa-image"></i>
      프로필사진 추가하기
    `;
  }

  const nickChkReq = () => {
    $.ajax({
      url: "http://localhost:3000/user/join/nicknamecheck",
      type: "get",
      xhrFields: { withCredentials: true },
      crossDomain: true,
      data: { nickname: $("#nickname-input").val() },
      contentType: "application/json",
      success: function (resp) {
        console.log(resp);
        if (resp === "ok") {
          nickChange = true;
          $("#nicknamecheck_p").text("");
          $("#nickname-input").removeClass("invalid");
          $("#nickLabel").removeClass("invalid");
        } else {
          nickChange = false;
          $("#nickname-input").addClass("invalid");
          $("#nickLabel").addClass("invalid");
          $("#nicknamecheck_p").text("");
          $("#nicknamecheck_p").text("이미 가입된 닉네임 입니다.");
        }
      },
      error: function () {
        alert("Register Error");
      },
    });
  };

  let nickBlurIsRun = true;
  $("#nickname-input").on("blur", function () {
    if (nickBlurIsRun) {
      return;
    }
    nickBlurIsRun = true;
    if ($("#nickname-input").val().trim() === "") {
      nickCheck = false;
      $("#nickname-input").addClass("invalid");
      $("#nickLabel").addClass("invalid");
      $("#nicknamecheck_p").text("");
      $("#nicknamecheck_p").text("필수 입력 항목입니다.");
    } else {
      nickChkReq();
    }
  });

  $("#nickname-input").on("propertychange change keyup paste input", () => {
    nickBlurIsRun = false;
  });

  $("#email-input").val(loggedInUser.email);
  $("#nickname-input").val(loggedInUser.nickname);
  $("#thumbnail-photo").append(profilePhoto);
  $("#editbtn").click(function () {
    if (nickChange) {
      let form_data = new FormData($("#editFrm")[0]);
      if (!$("#thumbnail-input").val()) {
        form_data.set("uploadFile", "");
      }
      form_data.append("seq", loggedInUser.seq);
      console.log(form_data.get("uploadFile"));
      $.ajax({
        url: "http://localhost:3000/user/update",
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
            alert("회원정보수정 성공");
          } else {
            alert("회원정보수정 실패");
          }
          location.href = `../user/userdetail.html?content=home&user=${loggedInUser.seq}`;
        },
        error: function () {
          alert("error");
        },
      });
    } else {
      alert("닉네임을 확인해주세요");
      $("#nickname-input").focus();
    }
  });

  $("#deletebtn").click(() => {
    if (confirm("정말 탈퇴하시겠습니까?")) {
      $.ajax({
        url: "http://localhost:3000/user/resign",
        type: "post",
        xhrFields: { withCredentials: true },
        crossDomain: true,
        data: { seq: loggedInUser.seq },
        success: function (str) {
          if (str === "YES") {
            alert("정상적으로 탈퇴되었습니다");
          } else {
            alert("탈퇴실패");
          }
          location.href = `../sns/main.html`;
        },
        error: function () {
          alert("error");
        },
      });
    }
  });

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
});
