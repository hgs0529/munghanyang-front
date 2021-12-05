$(document).ready(() => {
  let categories = $(".fillter_category").children();
  let page = 0;
  let cate = "전체";
  let groupno = 0;
  let order = 0;
  if (loadedPage === "knowhow") {
    groupno = 1;
  } else if (loadedPage === "review") {
    groupno = 2;
  } else if (loadedPage === "bbs") {
    groupno = 3;
  } else {
    groupno = 4;
  }

  const loadPage = () => {
    $.ajax({
      url: "http://localhost:3000/feed/getall",
      type: "get",
      xhrFields: { withCredentials: true },
      crossDomain: true,
      data: {
        groupno,
        page,
        cate,
        userid: loggedInUser ? loggedInUser.seq : 0,
        order,
      },
      success: function (resp) {
        console.log(resp);
        if (resp.length === 20) {
          oneTime = false;
        } else {
          oneTime = true;
        }
        console.log("사진");
        resp.forEach((feed) => {
          const files = feed.file.split("?");
          if (groupno === 4) {
            let comment = "";
            if (feed.recentcomment) {
              comment = `
              <div class="${loadedPage}-content-wrap_comment">
              <div>${feed.commentwriter}</div>
              <div>${
                feed.recentcomment.length > 10
                  ? feed.recentcomment.substring(0, 10)
                  : feed.recentcomment
              }</div>
              </div>
              `;
            }
            let followBtn = "";
            if (loggedInUser && feed.userid !== loggedInUser.seq) {
              followBtn = `<div class="followBtn ${
                feed.isfollow ? "following" : "follow"
              }" data-seq="${feed.userid}" >${
                feed.isfollow ? "팔로잉" : "팔로우"
              }</div>`;
            }
            $(`.bbs-block-list`).append(`
            <div class="${loadedPage}-block-item">
              <div class="${loadedPage}-header-wrap">
                <div class="${loadedPage}-profile-wrap" onclick="location.href='../user/userdetail.html?content=home&user=${
              feed.userid
            }'"><img src="${
              feed.avatar ? feed.avatar : "/upload/avatar/basic.jpg"
            }"></div>
                <div class="${loadedPage}-name-wrap">
                  <div>${feed.nickname}</div>
                  ${followBtn}
                </div>
              </div>
              <div class="image-wrap" onclick="location.href='../sns/photodetail.html?seq=${
                feed.seq
              }&userid=${feed.userid}'">
                ${files.length > 1 ? '<i class="fas fa-clone"></i>' : ""}
                <img src="${files[0]}" />
              </div>
              <div class="${loadedPage}-content-wrap">
                <div class="${loadedPage}-content-wrap_icons">
                  <span>
                    ${
                      feed.isliked
                        ? '<i class="fas fa-heart likeBtn" data-seq="' +
                          feed.seq +
                          '"></i>'
                        : '<i class="far fa-heart likeBtn" data-seq="' +
                          feed.seq +
                          '"></i>'
                    }
                    <p id="like${feed.seq}">${
              feed.likecount ? feed.likecount : ""
            }</p>
                  </span>
                  <span>
                    <i class="far fa-eye"></i>
                    ${feed.readcount ? feed.readcount : ""}
                  </span>
                  <span>
                    <i class="far fa-comment"></i>
                    ${feed.commentcount}
                  </span>
                </div>
                <div class="${loadedPage}-content-wrap_content">
                  ${
                    feed.content.length > 20
                      ? feed.content.substring(0, 20) + "..."
                      : feed.content
                  }
                </div>
                ${comment}
              </div>
            </div>
          `);
          } else {
            $(`.bbs-block-list`).append(`
            <div class="${loadedPage}-block-item" onclick="location.href='../sns/bbsdetail.html?seq=${feed.seq}&userid=${feed.userid}'">
              <div class="image-wrap">
                <img src="${feed.file}" />
              </div>
              <div class="${loadedPage}-content-wrap">
                <div class="${loadedPage}-content-wrap_title">
                  ${feed.title}
                </div>
                <div class="content-wrap_profile">${feed.nickname}</div>
                <div class="content-wrap_data">조회 ${feed.readcount} | 추천 ${feed.likecount}</div>
              </div>
            </div>
          `);
          }
        });
        $(".likeBtn").click(function (e) {
          if (loggedInUser) {
            $.ajax({
              url: "http://localhost:3000/feed/likes",
              type: "post",
              data: { userid: loggedInUser.seq, photoid: e.target.dataset.seq },
              xhrFields: { withCredentials: true },
              crossDomain: true,
              success: function (msg) {
                if (msg === "unlikes") {
                  let likesP = $("#like" + e.target.dataset.seq)
                    .text()
                    .trim();
                  e.target.classList.remove("fas");
                  e.target.classList.add("far");
                  $("#like" + e.target.dataset.seq).text("");
                  $("#like" + e.target.dataset.seq).append(`
                    ${likesP === "1" ? "" : likesP - 1}
                  `);
                } else {
                  let likesP = $("#like" + e.target.dataset.seq)
                    .text()
                    .trim();
                  $("#like" + e.target.dataset.seq).text("");
                  console.log(likesP);
                  $("#like" + e.target.dataset.seq).append(
                    `${!likesP ? 1 : Number.parseInt(likesP) + 1}`
                  );
                  e.target.classList.remove("far");
                  e.target.classList.add("fas");
                }
              },
              error: function () {
                console.log("error");
              },
            });
          } else {
            location.href = "../user/login.html";
          }
        });
        $(".followBtn").click((e) => {
          $.ajax({
            url: "http://localhost:3000/feed/follow",
            type: "post",
            data: {
              follow_give: loggedInUser.seq,
              follow_recv: e.target.dataset.seq,
            },
            xhrFields: { withCredentials: true },
            crossDomain: true,
            success: function (msg) {
              if (msg === "follow") {
                for (i = 0; i < $(".followBtn").length; i++) {
                  if ($(".followBtn")[i].dataset.seq === e.target.dataset.seq) {
                    $(".followBtn")[i].innerText = "팔로잉";
                    $(".followBtn")[i].classList.remove("follow");
                    $(".followBtn")[i].classList.add("following");
                  }
                }
              } else {
                for (i = 0; i < $(".followBtn").length; i++) {
                  if ($(".followBtn")[i].dataset.seq === e.target.dataset.seq) {
                    $(".followBtn")[i].innerText = "팔로우";
                    $(".followBtn")[i].classList.remove("following");
                    $(".followBtn")[i].classList.add("follow");
                  }
                }
              }
            },
            error: function () {
              console.log("error");
            },
          });
        });
        page++;
      },
      error: function () {
        console.log("error");
      },
    });
  };

  //스크롤 바닥 감지
  let oneTime = false;
  window.onscroll = function (e) {
    //window height + window scrollY 값이 document height보다 클 경우,
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight &&
      !oneTime
    ) {
      oneTime = true;
      console.log("바닥");
      loadPage();
    }
  };

  // 카테고리 버튼들에 이벤트리스너를 생성
  for (i = 0; i < categories.length; i++) {
    categories[i].addEventListener("click", function () {
      for (i = 0; i < categories.length; i++) {
        categories[i].classList.remove("selected");
      }
      page = 0;
      cate = this.innerText;
      console.log(this.innerText);
      $(`.bbs-block-list`).html("");
      loadPage();
      this.classList.add("selected");
    });
  }

  $(".order-dropdown-item").click((e) => {
    if (e.target.innerText === "최신순") {
      order = 0;
      $(".dropdown-order-button").text("최신순");
    } else if (e.target.innerText === "인기순") {
      order = 1;
      $(".dropdown-order-button").text("인기순");
    } else {
      order = 2;
      $(".dropdown-order-button").text("과거순");
    }
    page = 0;
    $(".order-dropdown").css("display", "none");
    $(`.bbs-block-list`).html("");
    loadPage();
  });

  $(".dropdown-order-button").click(() => {
    if ($(".order-dropdown").css("display") === "none") {
      $(".order-dropdown").css("display", "block");
    } else {
      $(".order-dropdown").css("display", "none");
    }
  });

  loadPage();
});
