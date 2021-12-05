$(document).ready(() => {
  $.ajax({
    url: "http://localhost:3000/feed/getcategoryfeed",
    type: "get",
    data: { userid: loggedInUser ? loggedInUser.seq : 0, groupno: 1 },
    xhrFields: { withCredentials: true },
    crossDomain: true,
    success: function (resp) {
      console.log(resp);
      if (resp.length === 0) {
      } else {
        resp.forEach((feed) => {
          $(".best-knowhow-block-list").append(`
          <div class="best-knowhow-main-item">
            <div class="best-knowhow-image-wrap">
              <img src="${
                feed.file
              }" onclick="location.href='../sns/bbsdetail.html?seq=${
            feed.seq
          }'" />
            </div>
            <div class="best-knowhow-content-wrap">
              <div class="best-knowhow-content-wrap_title">
                ${feed.title}
              </div>
              <div class="best-knowhow-content-wrap_profile">
                <div class="best-knowhow-content-wrap_avatar">
                <img src="${
                  feed.avatar ? feed.avatar : "/upload/avatar/basic.jpg"
                }" />
                </div>
                <div class="best-knowhow-content-wrap_nick">${
                  feed.nickname
                }</div>
              </div>
            </div>
          </div>
          `);
        });
      }
    },
    error: function () {
      console.log("error");
    },
  });

  $.ajax({
    url: "http://localhost:3000/feed/getcategoryfeed",
    type: "get",
    data: { userid: loggedInUser ? loggedInUser.seq : 0, groupno: 4 },
    xhrFields: { withCredentials: true },
    crossDomain: true,
    success: function (resp) {
      console.log(resp);
      if (resp.length === 0) {
      } else {
        for (i = 0; i < resp.length; i++) {
          $(".best-photo-block-list").append(`
          <div class="best-photo-main-item">
            <div class="best-photo-image-wrap">
              <img src="${
                resp[i].file.split("?")[0]
              }" onclick="location.href='../sns/photodetail.html?seq=${
            resp[i].seq
          }'" />
              ${
                i < 3
                  ? "<div class='bookmark'><span>" + (i + 1) + "</span></div>"
                  : ""
              }
              <div class="best-photo-main_profile">
                <img src="${
                  resp[i].avatar ? resp[i].avatar : "/upload/avatar/basic.jpg"
                }" />
                <span>${resp[i].nickname}</span>
              </div>
              ${
                resp[i].file.split("?").length > 1
                  ? '<div class="best-photo-main_icon"><i class="fas fa-clone"></i></div>'
                  : ""
              }
            </div>
          </div>
          `);
        }
      }
    },
    error: function () {
      console.log("error");
    },
  });

  $.ajax({
    url: "http://localhost:3000/feed/getcategoryfeed",
    type: "get",
    data: { userid: loggedInUser ? loggedInUser.seq : 0, groupno: 2 },
    xhrFields: { withCredentials: true },
    crossDomain: true,
    success: function (resp) {
      console.log(resp);
      if (resp.length === 0) {
      } else {
        resp.forEach((feed) => {
          $(".best-review-block-list").append(`
          <div class="best-review-main-item">
            <div class="best-review-image-wrap">
              <img src="${
                feed.file
              }" onclick="location.href='../sns/bbsdetail.html?seq=${
            feed.seq
          }'" />
            </div>
            <div class="best-review-content-wrap">
              <div class="best-review-content-wrap_title">
                ${feed.title}
              </div>
              <div class="best-review-content-wrap_profile">
                <div class="best-review-content-wrap_avatar">
                <img src="${
                  feed.avatar ? feed.avatar : "/upload/avatar/basic.jpg"
                }" />
                </div>
                <div class="best-review-content-wrap_nick">${
                  feed.nickname
                }</div>
              </div>
            </div>
          </div>
          `);
        });
      }
    },
    error: function () {
      console.log("error");
    },
  });

  $.ajax({
    url: "http://localhost:3000/feed/getcategoryfeed",
    type: "get",
    data: { userid: loggedInUser ? loggedInUser.seq : 0, groupno: 3 },
    xhrFields: { withCredentials: true },
    crossDomain: true,
    success: function (resp) {
      console.log(resp);
      if (resp.length === 0) {
      } else {
        resp.forEach((feed) => {
          $(".best-bbs-block-list").append(`
          <div class="best-bbs-main-item">
            <div class="best-bbs-image-wrap">
              <img src="${
                feed.file
              }" onclick="location.href='../sns/bbsdetail.html?seq=${
            feed.seq
          }'" />
            </div>
            <div class="best-bbs-content-wrap">
              <div class="best-bbs-content-wrap_title">
                ${feed.title}
              </div>
              <div class="best-bbs-content-wrap_profile">
                <div class="best-bbs-content-wrap_avatar">
                <img src="${
                  feed.avatar ? feed.avatar : "/upload/avatar/basic.jpg"
                }" />
                </div>
                <div class="best-bbs-content-wrap_nick">${feed.nickname}</div>
              </div>
            </div>
          </div>
          `);
        });
      }
    },
    error: function () {
      console.log("error");
    },
  });
});
