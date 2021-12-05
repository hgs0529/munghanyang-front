const createHeaderList = () => {
  if (loggedInUser.auth === 1) {
    return `
    <div class="dropdown-item" onclick="location.href='../user/userdetail.html?content=home&user=${loggedInUser.seq}'">마이홈</div>
    <div class="dropdown-item" onclick="location.href='../user/editprofile.html'">회원정보수정</div>
    <div class="dropdown-item" onclick="location.href='../user/userdetail.html?content=pet&user=${loggedInUser.seq}'">반려동물</div>
    <div class="dropdown-item" onclick="location.href='../user/userdetail.html?content=like&user=${loggedInUser.seq}'">좋아요</div>
    <div class="dropdown-item" onclick="location.href='../user/userdetail.html?content=bbs&user=${loggedInUser.seq}'">나의 게시글</div>
    <div class="dropdown-item" onclick="location.href='../user/userdetail.html?content=orderlist&user=${loggedInUser.seq}'">주문내역</div>
    <div class="dropdown-item" id="logout">로그아웃</div>
    `;
  } else {
    return `
      <div class="dropdown-item" onclick="location.href='../user/userdetail.html?content=home&user=${loggedInUser.seq}'">마이홈</div>
      <div class="dropdown-item" onclick="location.href='../user/editprofile.html'">회원정보수정</div>
      <div class="dropdown-item" onclick="location.href='../user/userdetail.html?content=pet&user=${loggedInUser.seq}'">반려동물</div>
      <div class="dropdown-item" onclick="location.href='../user/userdetail.html?content=like&user=${loggedInUser.seq}'">좋아요</div>
      <div class="dropdown-item" onclick="location.href='../user/userdetail.html?content=bbs&user=${loggedInUser.seq}'">나의 게시글</div>
      <div class="dropdown-item" onclick="location.href='../admin/addproduct.html'">상품등록</div>
      <div class="dropdown-item" onclick="location.href='../admin/asklist.html'">상품문의목록</div>
      <div class="dropdown-item" id="logout">로그아웃</div>
    `;
  }
};

const loadHeader = () => {
  if (loggedInUser) {
    //$("#header_menu").append("<li><a href='main.html?content=user_chatlist'>디엠</a></li>");

    $("#header_menu").append(
      `<img class='header_icon' src='/upload/logo/cart.png' onclick="location.href='../user/cart.html'">`
    );
    $("#header_menu").append(`
      <div class="dropdown-container">
        <button type="button" class="dropdown-button"><img class="dropdown-image" src='${
          !loggedInUser.avatar
            ? "/upload/avatar/basic.jpg"
            : loggedInUser.avatar
        }'><i class="fas fa-sort-down dropdown-icon"></i></button>
        <div class="dropdown">
          ${createHeaderList()}
        </div>
      </div>
    `);
    $(".dropdown-button").click(() => {
      if ($(".header_menu").find(".dropdown").css("display") === "none") {
        $(".header_menu").find(".dropdown").css("display", "block");
      } else {
        $(".header_menu").find(".dropdown").css("display", "none");
      }
    });
    //$("#header_menu").append("<a href='main.html?content=user_orderlist'>주문내역</a>");
    //$("#header_menu").append("<a href='main.html?content=user_edit'>회원정보수정</a>");
  } else {
    console.log("여기");
    $("#header_menu").append("<a href='../user/login.html'>로그인</a>");
    $("#header_menu").append("<span>|</span>");
    $("#header_menu").append("<a href='../user/join.html'>회원가입</a>");
  }
  if (loadedDir === "sns") {
    $("#header-nav_sns").addClass("selected");
    $("#header-nav_store").addClass("deselected");
  } else if (loadedDir === "store") {
    $("#header-nav_sns").addClass("deselected");
    $("#header-nav_store").addClass("selected");
  } else {
    $("#header-nav_sns").addClass("deselected");
    $("#header-nav_store").addClass("deselected");
  }
};

const logout = () => {
  $.ajax({
    url: "http://localhost:3000/user/logout",
    type: "post",
    xhrFields: { withCredentials: true },
    crossDomain: true,
    success: (resp) => {
      if (resp) {
        alert("로그아웃 성공");
      } else {
        alert("로그아웃 실패");
      }
      location.href = "../sns/main.html";
    },
  });
};

const goMainPage = (dest) => {
  location.href = `../${dest}/main.html`;
  $("#header-nav_store").removeClass();
  if (dest === "sns") {
    $("#header-nav_sns").addClass("selected");
    $("#header-nav_store").addClass("deselected");
  } else {
    $("#header-nav_store").addClass("selected");
    $("#header-nav_sns").addClass("deselected");
  }
};

const init = () => {
  loadHeader();
};

init();
$("#logout").click(logout);
