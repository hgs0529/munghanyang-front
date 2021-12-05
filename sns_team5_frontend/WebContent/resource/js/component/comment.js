$(document).ready(() => {
  const url = new URL(location.href);
  const urlParams = url.searchParams;
  const seq = urlParams.get("seq");
  const userid = urlParams.get("userid");

  const getCommentsReq = () => {
    console.log("getCommentsReq");
    $.ajax({
      url: "http://localhost:3000/comments/all",
      xhrFields: { withCredentials: true },
      crossDomain: true,
      data: { photoid: seq, login: loggedInUser ? loggedInUser.seq : 0 },
      success: function (comments) {
        console.log(comments);
        $(".comment-comments").html("");
        $(".comment-count").text(comments.length);
        comments.forEach((comment) => {
          let followbtn = "";
          let writer = "";
          let deleteBtn = "";
          if (loggedInUser && comment.userid !== loggedInUser.seq) {
            if (comment.isfollow) {
              followbtn = `· <span class="follow-link following" data-userid="${comment.userid}">팔로잉</span>`;
            } else {
              followbtn = `· <span class="follow-link" data-userid="${comment.userid}">팔로우</span>`;
            }
          }
          if (loggedInUser && comment.userid === loggedInUser.seq) {
            deleteBtn = `
              <div class="comment-delete" data-seq="${comment.seq}">삭제</div>
                `;
          }
          if (comment.userid === Number.parseInt(userid)) {
            writer = ` · <span class="writer">작성자</span>`;
          }
          if (!comment.parent) {
            $(".comment-comments").append(`
                <div class="comment-comments-item">
                  <div class="comments-profile-wrap">
                    <img src="${
                      comment.avatar
                        ? comment.avatar
                        : "/upload/avatar/basic.jpg"
                    }">
                  </div>
                  <div class="comments-main">
                    <div class="comments-main_main" id="comment${comment.seq}">
                      <div class="comments-main_comment-top">
                        <div class="comments-main_comment-top_name">
                          <span>${comment.nickname}</span>
                          ${followbtn}
                          ${writer}
                        </div>
                        <div class="comments-main_comment-top_date">${displayedAt(
                          comment.cdate
                        )}</div>
                      </div>
                      <div class="comments-main_comment-mid">
                        ${comment.content}
                      </div>
                      <div class="comments-main_comment-bot">
                        <div class="comments-main_comment-bot_like">
                          <div class="comments-main_comment-bot_like-left">
                            ${
                              comment.isliked
                                ? '<i class="fas fa-heart comment-likebtn" data-seq="' +
                                  comment.seq +
                                  '"></i>'
                                : '<i class="far fa-heart comment-likebtn" data-seq="' +
                                  comment.seq +
                                  '"></i>'
                            }
                            <div id="likecount${comment.seq}">${
              comment.likecount
            }</div>
                            <div class="comments-main_comment-bot_open_replyinput" data-parent="${
                              comment.seq
                            }" data-seq="${comment.seq}" data-nick="${
              comment.nickname
            }"> · 답글달기</div>
                          </div>
                          ${deleteBtn}
                        </div>
                      </div>
                    </div>
                    <div class="comments-main_reply" id="main_reply${
                      comment.seq
                    }"></div>
                  </div>
                </div>
              `);
          }
        });
        comments.forEach((comment) => {
          let followbtn = "";
          let writer = "";
          let deleteBtn = "";
          if (loggedInUser && comment.userid !== loggedInUser.seq) {
            if (comment.isfollow) {
              followbtn = `· <span class="follow-link following" data-userid="${comment.userid}">팔로잉</span>`;
            } else {
              followbtn = `· <span class="follow-link" data-userid="${comment.userid}">팔로우</span>`;
            }
          }
          if (loggedInUser && comment.userid === loggedInUser.seq) {
            deleteBtn = `
              <div class="comment-delete" data-seq="${comment.seq}">삭제</div>
                `;
          }
          if (comment.userid === Number.parseInt(userid)) {
            writer = ` · <span class="writer">작성자</span>`;
          }
          if (comment.parent) {
            $("#main_reply" + comment.parent).append(`
            <div class="reply-item">
              <div class="reply-profile-wrap">
                <img src="${
                  comment.avatar ? comment.avatar : "/upload/avatar/basic.jpg"
                }">
              </div>
              <div class="reply-main">
                <div class="reply-main_main" id="reply${comment.seq}">
                  <div class="reply-main_comment-top">
                    <div class="reply-main_comment-top_name">
                      <span>${comment.nickname}</span>
                      ${followbtn}
                      ${writer}
                    </div>
                    <div class="reply-main_comment-top_date">${displayedAt(
                      comment.cdate
                    )}</div>
                  </div>
                  <div class="reply-main_comment-mid">
                    ${comment.content}
                  </div>
                  <div class="reply-main_comment-bot">
                    <div class="reply-main_comment-bot_like">
                      <div class="reply-main_comment-bot_like-left">
                        ${
                          comment.isliked
                            ? '<i class="fas fa-heart comment-likebtn" data-seq="' +
                              comment.seq +
                              '"></i>'
                            : '<i class="far fa-heart comment-likebtn" data-seq="' +
                              comment.seq +
                              '"></i>'
                        }
                        <div id="likecount${comment.seq}">${
              comment.likecount
            }</div>
                      </div>
                      ${deleteBtn}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            `);
          }
        });

        $(".follow-link").click((e) => {
          if (loggedInUser) {
            $.ajax({
              url: "http://localhost:3000/feed/follow",
              xhrFields: { withCredentials: true },
              crossDomain: true,
              type: "post",
              data: {
                follow_give: loggedInUser.seq,
                follow_recv: e.target.dataset.userid,
              },
              success: (resp) => {
                if (resp === "follow") {
                  e.target.classList.add("following");
                  e.target.innerText = "팔로잉";
                } else {
                  e.target.classList.remove("following");
                  e.target.innerText = "팔로우";
                }
              },
              error: () => {
                alert("삭제실패");
              },
            });
          }
        });

        $(".comment-delete").click((e) => {
          console.log(e.target.dataset.seq);
          $.ajax({
            url: "http://localhost:3000/comments/del",
            xhrFields: { withCredentials: true },
            crossDomain: true,
            type: "post",
            data: {
              commentid: e.target.dataset.seq,
            },
            success: (resp) => {
              if (resp === "OK") {
                getCommentsReq();
              } else {
                alert("삭제실패");
              }
            },
            error: () => {
              alert("삭제실패");
            },
          });
        });

        $(".comment-likebtn").click((e) => {
          if (loggedInUser) {
            $.ajax({
              url: "http://localhost:3000/comments/likes",
              xhrFields: { withCredentials: true },
              crossDomain: true,
              type: "post",
              data: {
                commentid: e.target.dataset.seq,
                userid: loggedInUser.seq,
              },
              success: (resp) => {
                if (resp === "likes") {
                  e.target.classList.replace("far", "fas");
                  $("#likecount" + e.target.dataset.seq).text(
                    Number.parseInt(
                      $("#likecount" + e.target.dataset.seq).text()
                    ) + 1
                  );
                } else {
                  e.target.classList.replace("fas", "far");
                  $("#likecount" + e.target.dataset.seq).text(
                    $("#likecount" + e.target.dataset.seq).text() - 1
                  );
                }
              },
              error: () => {
                alert("좋아요 등록실패");
              },
            });
          }
        });

        $(".comments-main_comment-bot_open_replyinput").click((e) => {
          if (loggedInUser) {
            const targetSeq = e.target.dataset.seq;
            const targetParent = e.target.dataset.parent;
            const targetNick = e.target.dataset.nick;
            if (
              $("#comment" + targetSeq)
                .children()
                .last()
                .attr("class") === "comment-write"
            ) {
              $("#comment" + targetSeq)
                .children()
                .last()
                .remove();
            } else {
              $("#comment" + targetSeq).append(`
            <div class="comment-write">
              <textarea
                name="content"
                id="comment-textarea${targetSeq}"
                placeholder="댓글을 입력해주세요"
              ></textarea>
              <div id="comment-writeBtn${targetSeq}" class="comment-writeBtn">등록</div>
            </div>
            `);

              $(`#comment-writeBtn${targetSeq}`).click(() => {
                if (
                  $(`#comment-textarea${targetSeq}`).val() &&
                  $(`#comment-textarea${targetSeq}`).val().trim() !== ""
                ) {
                  replyWriteReq(targetParent, targetSeq, targetNick);
                }
              });
              $(`#comment-textarea${targetSeq}`).keyup((e) => {
                e.preventDefault();
                if (
                  e.keyCode === 13 &&
                  $(`#comment-textarea${targetSeq}`).val() &&
                  $(`#comment-textarea${targetSeq}`).val().trim() !== ""
                ) {
                  console.log(targetSeq);
                  replyWriteReq(targetParent, targetSeq, targetNick);
                }
              });
            }
          } else {
            if (
              confirm("로그인이 필요합니다. 로그인페이지로 이동하시겠습니까?")
            ) {
              location.href = "../user/login.html";
            }
          }
        });
      },
      error: function () {
        alert("error");
      },
    });
  };

  const replyWriteReq = (parentSeq, commentSeq, nick) => {
    console.log(commentSeq);
    console.log(parentSeq);
    $.ajax({
      url: "http://localhost:3000/comments/new/answer",
      type: "post",
      xhrFields: { withCredentials: true },
      crossDomain: true,
      data: {
        seq: parentSeq,
        photoid: seq,
        userid: loggedInUser.seq,
        refuser: nick,
        content: $(`#comment-textarea${commentSeq}`).val().trim(),
      },
      success: function (resp) {
        console.log(resp);
        $("#comment-textarea").val("");
        if (resp === "OK") {
          getCommentsReq();
        } else {
        }
      },
      error: function () {
        alert("error");
      },
    });
  };

  const commentWriteReq = () => {
    $.ajax({
      url: "http://localhost:3000/comments/new",
      type: "post",
      xhrFields: { withCredentials: true },
      crossDomain: true,
      data: {
        photoid: seq,
        userid: loggedInUser.seq,
        content: $("#comment-textarea").val().trim(),
      },
      success: function (resp) {
        console.log(resp);
        $("#comment-textarea").val("");
        if (resp === "OK") {
          getCommentsReq();
        } else {
        }
      },
      error: function () {
        alert("error");
      },
    });
  };

  if (loggedInUser) {
    $("#comment-textarea").keyup((e) => {
      e.preventDefault();
      if (
        e.keyCode === 13 &&
        $("#comment-textarea").val() &&
        $("#comment-textarea").val().trim() !== ""
      ) {
        commentWriteReq();
      }
    });
    $("#comment-writeBtn").click(() => {
      console.log($("#comment-textarea").val().trim());
      if (
        $("#comment-textarea").val() &&
        $("#comment-textarea").val().trim() !== ""
      ) {
        commentWriteReq();
      }
    });
  } else {
    $("#comment-textarea").attr("readonly", true);
    $("#comment-textarea").attr(
      "placeholder",
      "댓글을 작성하려면 로그인해주세요"
    );
  }

  getCommentsReq();
});
