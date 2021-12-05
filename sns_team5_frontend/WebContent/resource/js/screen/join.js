$(document).ready(() => {
  let emailCheck = false;
  let pwdCheck = false;
  let nickCheck = false;
  if (loggedInUser) {
    location.href = "../sns/main.html";
  }

  // 이메일 인증 요청
  let authkey = null;
  const smtpReq = () => {
    $("#smtpBtn").addClass("Disabled");
    $("#smtpBtn").off("click", smtpReq);
    $("#email-input").off("blur", emailEvent);
    $.ajax({
      url: "http://localhost:3000/user/join/emailauth",
      type: "get",
      xhrFields: { withCredentials: true },
      crossDomain: true,
      data: { email: $("#email-input").val() },
      beforeSend: () => {
        $("#smtpBtn").html("");
        $("#smtpBtn").append(`<div class="loading"></div>`);
      },
      complete: () => {
        $("#smtpBtn").html("");
        $("#smtpBtn").text("이메일 인증하기");
      },
      success: function (resp) {
        alert("이메일로 인증코드가 발송되었습니다.");
        authkey = resp;

        let time = 60 * 3;
        let intervalVar;

        let auth = `
          <div class="email-auth_title">
            이메일로 전송된 인증코드를 입력해주세요.
          </div>
          <div class="email-auth_main">
            <div class="email-auth_main-input">
              <input
                type="text"
                id="emailauth-input"
                placeholder="인증코드 입력"
              />
              <p id="timer">3:00</p>
              <button type="button" id="emailauthBtn" class="invalid">확인</button>
            </div>
            <div id="email-auth_alret"></div>
          </div>
          <div class="email-auth_again">
            <span
              ><i class="fas fa-exclamation-circle"></i>이메일을 받지
              못하셨나요?<a id="authAgain" href="#">이메일 재전송하기</a></span
            >
          </div>
        `;
        $("#email-auth").html("");
        $("#email-auth").append(auth);

        const emailAuthCallback = () => {
          if ($("#emailauth-input").val() === authkey) {
            $("#smtpBtn").text("이메일 인증완료");
            console.log("emailCheck1", emailCheck);
            $("#email-input").attr("readonly", true);
            $("#email-auth").html("");
            emailCheck = true;
            console.log("emailCheck2", emailCheck);
            clearInterval(intervalVar);
          } else {
            $("#email-auth_alret").text("인증코드가 일치하지 않습니다.");
            $("#email-auth_alret").addClass("active");
            $(".email-auth_main").addClass("invalid");
            $("emailauth-input").val("").focus();
            emailCheck = false;
          }
          console.log("emailCheck3", emailCheck);
        };

        intervalVar = setInterval(function () {
          if (time !== 0) {
            time = time - 1;
            $("#timer").text(getTimeString(time));
          } else {
            clearInterval(intervalVar);
            $("#timer").text("0:00");
            $("#email-auth_alret").text("인증코드가 만료되었습니다.");
            $("#email-auth_alret").addClass("active");
            $(".email-auth_main").addClass("invalid");
            $("#emailauthBtn").off("click", emailAuthCallback);
            $("#emailauthBtn").addClass("invalid");
          }
        }, 1000);

        const emailAuthEvent = () => {
          $("#emailauthBtn").off("click", emailAuthCallback);
          if (time !== 0) {
            if ($("#emailauth-input").val().trim() === "") {
              $("#emailauthBtn").off("click", emailAuthCallback);
              $("#emailauthBtn").addClass("invalid");
            } else {
              $("#emailauthBtn").on("click", emailAuthCallback);
              $("#emailauthBtn").removeClass("invalid");
            }
          } else {
            $("#emailauthBtn").off("click", emailAuthCallback);
            $("#emailauthBtn").addClass("invalid");
          }
        };

        $("#emailauth-input").on(
          "propertychange change keyup paste input",
          emailAuthEvent
        );

        $("#authAgain").on("click", () => {
          clearInterval(intervalVar);
          $("#email-auth").html("");
          smtpReq();
        });
      },
      error: function () {
        alert("Email Error");
      },
    });
  };

  function getTimeString(time) {
    let minute = "" + Math.floor(time / 60);
    let second = time % 60;
    if (second < 10) {
      second = "0" + second;
    }
    return minute + ":" + second;
  }

  const joinReq = () => {
    $.ajax({
      url: "http://localhost:3000/user/join",
      type: "post",
      xhrFields: { withCredentials: true },
      crossDomain: true,
      data: {
        nickname: $("#nickname-input").val(),
        email: $("#email-input").val(),
        pwd: $("#pwd-input").val(),
      },
      success: function (resp) {
        if (resp === "ok") {
          alert("회원가입 성공");
        } else {
          alert("회원가입에 실패하였습니다");
        }
        location.href = "../user/login.html";
      },
      error: function () {
        alert("Register Error");
      },
    });
  };

  // 닉네임 체크 요청
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
          nickCheck = true;
          $("#nicknamecheck_p").text("");
          $("#nickname-input").removeClass("invalid");
          $("#nickLabel").removeClass("invalid");
        } else {
          nickCheck = false;
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

  // 이메일 체크 요청을 보냄
  let emailChkIsRun = false;
  const emailCheckReq = () => {
    if (emailChkIsRun) {
      return;
    }
    emailChkIsRun = true;
    $.ajax({
      url: "http://localhost:3000/user/join/emailcheck",
      type: "get",
      xhrFields: { withCredentials: true },
      crossDomain: true,
      data: { email: $("#email-input").val() },
      contentType: "application/json",
      success: function (resp) {
        if (resp === "ok") {
          $("#emailcheck_p").text("");
          $("#email-input").removeClass("invalid");
          $("#emailLabel").removeClass("invalid");
          emailCheck = true;
          $("#smtpBtn").removeClass("Disabled");
          $("#smtpBtn").on("click", smtpReq);
        } else if (resp === "email") {
          console.log("email");
          emailCheck = false;
          $("#email-input").addClass("invalid");
          $("#emailLabel").addClass("invalid");
          $("#emailcheck_p").text("");
          $("#emailcheck_p").text("이미 가입된 이메일 입니다.");
          $("#smtpBtn").addClass("Disabled");
          $("#smtpBtn").off("click", smtpReq);
        } else {
          emailCheck = false;
          $("#email-input").addClass("invalid");
          $("#emailLabel").addClass("invalid");
          $("#emailcheck_p").text("");
          $("#emailcheck_p").text(
            "sns로 가입한 이메일입니다. sns로그인을 이용해주세요."
          );
          $("#smtpBtn").addClass("Disabled");
          $("#smtpBtn").off("click", smtpReq);
        }
        emailChkIsRun = false;
      },
      error: function () {
        alert("Register Error");
      },
    });
  };

  const emailEvent = () => {
    if (emailBlurIsRun) {
      return;
    }
    emailBlurIsRun = true;
    const email_check = (email) => {
      var reg =
        /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
      return reg.test(email);
    };
    if ($("#email-input").val().trim() === "") {
      $("#email-input").addClass("invalid");
      $("#emailLabel").addClass("invalid");
      $("#emailcheck_p").text("");
      $("#emailcheck_p").text("필수 입력 항목입니다.");
      $(".join-title").addClass("invalid");
      emailCheck = false;
      $("#smtpBtn").addClass("Disabled");
      $("#smtpBtn").off("click", smtpReq);
    } else if (!email_check($("#email-input").val())) {
      $("#email-input").addClass("invalid");
      $("#emailLabel").addClass("invalid");
      $("#emailcheck_p").text("");
      $("#emailcheck_p").text("이메일 형식이 올바르지 않습니다.");
      emailCheck = false;
      $("#smtpBtn").addClass("Disabled");
      $("#smtpBtn").off("click", smtpReq);
    } else {
      emailCheckReq();
    }
  };

  // 이메일 체크 리스너
  let emailBlurIsRun = false;
  $("#email-input").on("blur", emailEvent);
  // email input을 수정해야만 다시 blur가 작동되도록 함
  $("#email-input").on("propertychange change keyup paste input", () => {
    emailBlurIsRun = false;
  });

  // 닉네임 체크 이벤트 리스너
  let nickBlurIsRun = false;
  $("#nickname-input").on("blur", function () {
    console.log("nick blur");
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
      console.log("emailCheck", emailCheck);
      nickChkReq();
    }
  });
  // nickname input을 수정해야만 다시 blur가 작동되도록 함
  $("#nickname-input").on("propertychange change keyup paste input", () => {
    nickBlurIsRun = false;
  });

  // 비밀번호 유효성 검사
  let pwdBlurIsRun = false;
  $("#pwd-input").on("blur", () => {
    if (pwdBlurIsRun) {
      return;
    }
    pwdBlurIsRun = true;
    const chk_num = $("#pwd-input").val().search(/[0-9]/g);
    const chk_eng = $("#pwd-input").val().search(/[a-z]/gi);
    console.log(chk_num);
    console.log(chk_eng);
    console.log($("#pwd-input").val().length);

    if ($("#pwd-input").val().trim() === "") {
      $("#pwd-input").addClass("invalid");
      $("#pwdLabel").addClass("invalid");
      $("#pwdcheck_p").text("");
      $("#pwdcheck_p").text("필수 입력 항목입니다.");
    } else if (chk_num < 0 || chk_eng < 0 || $("#pwd-input").val().length > 8) {
      $("#pwd-input").addClass("invalid");
      $("#pwdLabel").addClass("invalid");
      $("#pwdcheck_p").text("");
      $("#pwdcheck_p").text(
        "비밀번호는 영문, 숫자를 포함하여 8자 이상이어야 합니다."
      );
    } else {
      $("#pwdcheck_p").text("");
      $("#pwd-input").removeClass("invalid");
      $("#pwdLabel").removeClass("invalid");
    }
  });
  // nickname input을 수정해야만 다시 blur가 작동되도록 함
  $("#pwd-input").on("propertychange change keyup paste input", () => {
    pwdBlurIsRun = false;
  });

  // 비밀번호 확인과 똑같은지 검사
  $("#pwd2-input").on("propertychange change keyup paste input", () => {
    if ($("#pwd2-input").val() === $("#pwd-input").val()) {
      $("#pwdcheck_p2").text("");
      $("#pwd2-input").removeClass("invalid");
      $("#pwd2Label").removeClass("invalid");
      pwdCheck = true;
    } else {
      $("#pwdcheck_p2").text("");
      $("#pwd2-input").addClass("invalid");
      $("#pwd2Label").addClass("invalid");
      $("#pwdcheck_p2").text("비밀번호가 일치하지 않습니다.");
      pwdCheck = false;
    }
  });

  $("#joinbtn").click(function () {
    if (!emailCheck) {
      console.log(emailCheck);
      alert("이메일을 확인해주세요");
      $("#email-input").focus();
    } else if (!nickCheck) {
      alert("닉네임을 확인해주세요");
      $("#nickname-input").focus();
    } else if (!pwdCheck) {
      alert("비밀번호를 확인해주세요");
      $("#pwd-input").focus();
    } else {
      joinReq();
    }
  });
});
