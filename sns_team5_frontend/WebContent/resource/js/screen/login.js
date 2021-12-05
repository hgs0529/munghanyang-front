$(document).ready(() => {
  if (loggedInUser) {
    location.href = "../sns/main.html";
  }
  const email_check = (email) => {
    var reg =
      /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    return reg.test(email);
  };

  const loginReq = () => {
    if ($("#email-logininp").val().trim() === "") {
      alert("이메일을 확인을 해주세요");
      $("#email-logininp").focus();
      $("#email-logininp").addClass("invalid");
    } else if (!email_check($("#email-logininp").val().trim())) {
      alert("이메일 아이디로 로그인 해주세요");
      $("#email-logininp").focus();
      $("#email-logininp").addClass("invalid");
    } else if ($("#pwd-logininp").val().trim() === "") {
      alert("비밀번호를 확인을 해주세요");
      $("#pwd-logininp").focus();
      $("#pwd-logininp").addClass("invalid");
    } else {
      $.ajax({
        url: "http://localhost:3000/user/login",
        type: "post",
        data: {
          email: $("#email-logininp").val(),
          pwd: $("#pwd-logininp").val(),
        },
        xhrFields: { withCredentials: true },
        crossDomain: true,
        success: function (resp) {
          if (resp === "email") {
            alert("등록되지않은 이메일 입니다.");
            $("#email-logininp").addClass("invalid");
            $("#email-logininp").focus();
          } else if (resp === "pwd") {
            alert("비밀번호가 틀렸습니다");
            $("#email-logininp").focus();
            $("#pwd-logininp").addClass("invalid");
          } else {
            alert("로그인 성공");
            location.href = "../sns/main.html";
          }
        },
        error: function () {
          alert("Login Error");
        },
      });
    }
  };

  let emailBlurIsRun = false;
  $("#email-logininp").on("blur", () => {
    if (emailBlurIsRun) {
      return;
    }
    emailBlurIsRun = true;
    if ($("#email-logininp").val().trim() === "") {
      $("#email-logininp").addClass("invalid");
    } else if (!email_check($("#email-logininp").val().trim())) {
      $("#email-logininp").addClass("invalid");
    } else {
      $("#email-logininp").removeClass("invalid");
    }
  });

  $("#email-logininp").on("propertychange change keyup paste input", () => {
    emailBlurIsRun = false;
  });

  let pwdBlurIsRun = false;
  $("#pwd-logininp").on("blur", () => {
    if (pwdBlurIsRun) {
      return;
    }
    pwdBlurIsRun = true;
    if ($("#pwd-logininp").val().trim() === "") {
      $("#pwd-logininp").addClass("invalid");
    } else {
      $("#pwd-logininp").removeClass("invalid");
    }
  });

  $("#pwd-logininp").on("propertychange change keyup paste input", () => {
    pwdBlurIsRun = false;
  });

  $("#email-logininp").keyup((e) => {
    e.preventDefault();
    if (e.keyCode === 13) {
      loginReq();
    }
  });
  $("#pwd-logininp").keyup((e) => {
    e.preventDefault();
    if (e.keyCode === 13) {
      loginReq();
    }
  });
  $("#loginBtn").click(() => {
    loginReq();
  });
});
