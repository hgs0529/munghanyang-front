$(document).ready(() => {
  const url = new URL(location.href);
  const urlParams = url.searchParams;
  const seq = urlParams.get("seq");

  console.log(loggedInUser);
  $.ajax({
    url: "http://localhost:3000/feed/getfeed",
    xhrFields: { withCredentials: true },
    crossDomain: true,
    data: { userid: loggedInUser ? loggedInUser.seq : 0, seq },
    success: function (feed) {
      bbswriter = feed.userid;
      console.log(feed);
      $(".bbs-detail-content_header-top").append(`<p>${feed.cate}</p>`);
      $(".bbs-detail-content_header-title").text(feed.title);
      $(".header-bottom_profile").append(
        `<img src="${feed.avatar ? feed.avatar : "/upload/avatar/basic.jpg"}">`
      );
      $(".header-bottom_name-name").text(feed.nickname);
      const dateArr = feed.created.split(" ")[0].split("-");
      const date = `${dateArr[0]}년 ${dateArr[1]}월 ${dateArr[2]}일`;
      $(".header-bottom_name-date").text(date);
      if (loggedInUser) {
        if (loggedInUser.seq === feed.userid) {
          $(".bbs-detail-content_header-bottom_followbtn").text("삭제");
          $(".bbs-detail-content_header-bottom_followbtn").addClass(
            "bbs-detail-content_header-bottom_deleteBtn"
          );
          $(".bbs-detail-content_header-bottom_followbtn").removeClass(
            "bbs-detail-content_header-bottom_followbtn"
          );
        } else {
          if (feed.isfollow) {
            $(".bbs-detail-content_header-bottom_followbtn").text("팔로잉");
            $(".bbs-detail-content_header-bottom_followbtn").addClass("active");
          } else {
            $(".bbs-detail-content_header-bottom_followbtn").text("팔로우");
            $(".bbs-detail-content_header-bottom_followbtn").removeClass(
              "active"
            );
          }
        }
      } else {
        $(".bbs-detail-content_header-bottom_followbtn").remove();
      }
      $(".bbs-detail-content_content").append(
        `<img src="${feed.file}" style="width:800px;">`
      );
      $(".bbs-detail-content_content").append(feed.content);
      $(".bbs-detail-content_content").append(`
        <div class="thumbsupBtn${feed.isliked ? " active" : ""}">
          <i class="far fa-thumbs-up${feed.isliked ? " active" : ""}""></i>
          <div class="thumbsup-likecount">${feed.likecount}<div>
        </div>
      `);
      const hashtags = feed.hashtag.split("-");
      for (i = 0; i < hashtags.length; i++) {
        $(".bbs-detail-content_hashtags").append(`<div>${hashtags[i]}</div>`);
      }
      $(".like-count").text(feed.likecount);
      $(".read-count").text(feed.readcount);

      if (feed.groupno === 1) {
        $("#sns-nav_knowhow").css("color", "#fcce00");
        $("#sns-navlist_knowhow").css("border-color", "#fcce00");
      } else if (feed.groupno === 2) {
        $("#sns-nav_review").css("color", "#fcce00");
        $("#sns-navlist_review").css("border-color", "#fcce00");
      } else if (feed.groupno === 3) {
        $("#sns-nav_bbs").css("color", "#fcce00");
        $("#sns-navlist_bbs").css("border-color", "#fcce00");
      } else {
        $("#sns-nav_photo").css("color", "#fcce00");
        $("#sns-navlist_photo").css("border-color", "#fcce00");
      }

      $(".thumbsupBtn").click(() => {
        if (!loggedInUser) {
          if (confirm("로그인이 필요합니다. 로그인하시겠습니까?")) {
            location.href = "../user/login.html";
          }
        } else {
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
              const nowLikeCount = $(".thumbsup-likecount").text();
              if (resp === "likes") {
                $(".thumbsupBtn").addClass("active");
                $(".thumbsupBtn").find("i").addClass("active");
                $(".thumbsup-likecount").text(
                  Number.parseInt(nowLikeCount) + 1
                );
                $(".like-count").text(Number.parseInt(nowLikeCount) + 1);
              } else {
                $(".thumbsupBtn").removeClass("active");
                $(".thumbsupBtn").find("i").removeClass("active");
                $(".thumbsup-likecount").text(
                  Number.parseInt(nowLikeCount) - 1
                );
                $(".like-count").text(Number.parseInt(nowLikeCount) - 1);
              }
            },
            error: () => {
              alert("좋아요 등록실패");
            },
          });
        }
      });

      $(".bbs-detail-content_header-bottom_deleteBtn").click(() => {
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
              if (feed.groupno === 1) {
                location.href = "../sns/knowhow.html";
              } else if (feed.groupno === 2) {
                location.href = "../sns/review.html";
              } else {
                location.href = "../sns/bbs.html";
              }
            },
            error: () => {
              alert("삭제실패");
            },
          });
        }
      });

      $(".bbs-detail-content_header-bottom_followbtn").click(() => {
        if (loggedInUser) {
          $.ajax({
            url: "http://localhost:3000/feed/follow",
            xhrFields: { withCredentials: true },
            crossDomain: true,
            type: "post",
            data: {
              follow_give: loggedInUser.seq,
              follow_recv: bbswriter,
            },
            success: (resp) => {
              if (resp === "follow") {
                $(".bbs-detail-content_header-bottom_followbtn").text("팔로잉");
                $(".bbs-detail-content_header-bottom_followbtn").addClass(
                  "active"
                );
                $(".follow-link").each(function () {
                  if ($(this).data("userid") === bbswriter) {
                    $(this).text("팔로잉");
                    $(this).addClass("following");
                  }
                });
              } else {
                $(".bbs-detail-content_header-bottom_followbtn").text("팔로우");
                $(".bbs-detail-content_header-bottom_followbtn").removeClass(
                  "active"
                );
                $(".follow-link").each(function () {
                  if ($(this).data("userid") === bbswriter) {
                    $(this).text("팔로우");
                    $(this).removeClass("following");
                  }
                });
              }
            },
            error: () => {
              alert("팔로우실패");
            },
          });
        } else {
          if (confirm("로그인이 필요합니다. 로그인하시겠습니까?")) {
            location.href = "../user/login.html";
          }
        }
      });
    },
    error: function () {
      alert("error");
    },
  });
});
