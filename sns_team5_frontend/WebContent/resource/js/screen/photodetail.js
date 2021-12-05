$(document).ready(() => {
  const url = new URL(location.href);
  const urlParams = url.searchParams;
  const seq = urlParams.get("seq");

  $.ajax({
    url: "http://localhost:3000/feed/getfeed",
    xhrFields: { withCredentials: true },
    crossDomain: true,
    data: { userid: loggedInUser ? loggedInUser.seq : 0, seq },
    success: (feed) => {
      $("#sns-nav_photo").css("color", "#fcce00");
      $("#sns-navlist_photo").css("border-color", "#fcce00");
      $(".side-likeBtn-like").append(`
        <i class="${feed.isliked ? "fas" : "far"} fa-heart"></i
        ><span class="side-likeBtn-like-likecount"></span>
      `);
      if (loggedInUser) {
        if (loggedInUser.seq !== feed.userid) {
          if (feed.isfollow) {
            $(".photo-detail-content_side-likeBtn").append(`
              <div class="side-likeBtn-follow following">팔로잉</div>
            `);
          } else {
            $(".photo-detail-content_side-likeBtn").append(`
              <div class="side-likeBtn-follow">팔로우</div>
            `);
          }
        } else {
          $(".photo-detail-content_side-likeBtn").append(`
              <div class="side-likeBtn-delete">삭제</div>
            `);
        }
      }

      $(".bbs-detail-content_content").append(feed.content);
      $(".like-count").text(feed.likecount);
      $(".side-likeBtn-like-likecount").text(feed.likecount);
      $(".read-count").text(feed.readcount);
      $(".side-profile-imgwrap").append(
        `<img src="${feed.avatar ? feed.avatar : "/upload/avatar/basic.jpg"}">`
      );
      $(".side-profile-name").text(feed.nickname);
      const filesArr = feed.file.split("?");
      $("#photo-detail-slider").append(`
      ${
        filesArr.length > 1
          ? '<a href="#" class="control_next">></a><a href="#" class="control_prev"><</a>'
          : ""
      }
      <ul class="photo-detail-slider_item"></ul>
    `);
      $.ajax({
        url: "http://localhost:3000/feed/getother",
        xhrFields: { withCredentials: true },
        crossDomain: true,
        data: { userid: feed.userid, seq },
        success: (list) => {
          if (list.length > 0) {
            $(".photo-detail-content_side-othorPhoto-title").append(`
                <span>${feed.nickname}</span>님의 다른 사진
              `);
            list.forEach((photo) => {
              $(".photo-detail-content_side-othorPhoto").append(`
                <div><img src="${
                  photo.file.split("?")[0]
                }" onclick="location.href='../sns/photodetail.html?seq=${
                photo.seq
              }'"></div>
              `);
            });
            if (list.length === 1 || list.length === 3) {
              $(".photo-detail-content_side-othorPhoto").append(`
                <div></div>
              `);
            }
            $(".photo-detail-content_side-othorPhoto").append(`
              <div class="goUserDetail">더보기</div>
            `);
          }
        },
        error: () => {
          alert("error");
        },
      });

      filesArr.forEach(function (f) {
        $(".photo-detail-slider_item").append(`
          <li><img src="${f}"></li>
        `);
      });

      var slideCount = $("#photo-detail-slider ul li").length;
      var slideWidth = $("#photo-detail-slider ul li").width();
      var slideHeight = $("#photo-detail-slider ul li").height();
      var sliderUlWidth = slideCount * slideWidth;

      $("#photo-detail-slider").css({
        width: slideWidth,
        height: slideHeight,
      });

      $("#photo-detail-slider ul li:last-child").prependTo(
        "#photo-detail-slider ul"
      );

      function moveLeft() {
        $("#photo-detail-slider ul").animate(
          {
            left: +slideWidth,
          },
          200,
          function () {
            $("#photo-detail-slider ul li:last-child").prependTo(
              "#photo-detail-slider ul"
            );
            $("#photo-detail-slider ul").css("left", "");
          }
        );
      }

      function moveRight() {
        $("#photo-detail-slider ul").animate(
          {
            left: -slideWidth,
          },
          200,
          function () {
            $("#photo-detail-slider ul li:first-child").appendTo(
              "#photo-detail-slider ul"
            );
            $("#photo-detail-slider ul").css("left", "");
          }
        );
      }

      $("a.control_prev").click(function () {
        moveLeft();
      });

      $("a.control_next").click(function () {
        moveRight();
      });

      $(".side-likeBtn-follow").click(() => {
        if (loggedInUser) {
          $.ajax({
            url: "http://localhost:3000/feed/follow",
            xhrFields: { withCredentials: true },
            crossDomain: true,
            type: "post",
            data: {
              follow_give: loggedInUser.seq,
              follow_recv: feed.userid,
            },
            success: (resp) => {
              if (resp === "follow") {
                $(".side-likeBtn-follow").addClass("following");
                $(".side-likeBtn-follow").text("팔로잉");
              } else {
                $(".side-likeBtn-follow").removeClass("following");
                $(".side-likeBtn-follow").text("팔로우");
              }
            },
            error: () => {
              alert("팔로우실패");
            },
          });
        }
      });

      $(".side-likeBtn-delete").click(() => {
        console.log(seq);
        if (loggedInUser) {
          $.ajax({
            url: "http://localhost:3000/feed/del",
            xhrFields: { withCredentials: true },
            crossDomain: true,
            type: "post",
            data: {
              seq,
            },
            success: (resp) => {
              if (resp === "YES") {
                alert("삭제성공");
              } else {
                alert("삭제실패");
              }
              location.href = "../sns/photo.html";
            },
            error: () => {
              alert("삭제실패");
            },
          });
        }
      });

      $(".side-likeBtn-like").click(() => {
        if (loggedInUser) {
          $.ajax({
            url: "http://localhost:3000/feed/likes",
            xhrFields: { withCredentials: true },
            crossDomain: true,
            type: "post",
            data: {
              photoid: seq,
              userid: loggedInUser.seq,
            },
            success: (resp) => {
              const nowLikeCount = $(".side-likeBtn-like-likecount").text();
              if (resp === "likes") {
                $(".side-likeBtn-like").find("i").removeClass("far");
                $(".side-likeBtn-like").find("i").addClass("fas");
                $(".side-likeBtn-like-likecount").text(
                  Number.parseInt(nowLikeCount) + 1
                );
                $(".like-count").text(Number.parseInt(nowLikeCount) + 1);
              } else {
                $(".side-likeBtn-like").find("i").addClass("far");
                $(".side-likeBtn-like").find("i").removeClass("fas");
                $(".side-likeBtn-like-likecount").text(
                  Number.parseInt(nowLikeCount) - 1
                );
                $(".like-count").text(Number.parseInt(nowLikeCount) - 1);
              }
            },
            error: () => {
              alert("좋아요 등록실패");
            },
          });
        } else {
          if (confirm("로그인이 필요합니다. 로그인하시겠습니까?")) {
            location.href = "../user/login.html";
          }
        }
      });
    },
    error: () => {
      alert("error");
    },
  });
});
