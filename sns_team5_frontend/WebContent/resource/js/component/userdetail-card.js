$(document).ready(() => {
  $(".user-card-profile_imgwrap").append(`
      <img src="${
        selectedUser.avatar ? selectedUser.avatar : "/upload/avatar/basic.jpg"
      }">
    `);
  $(".user-card-profile_nick").text(selectedUser.nickname);
  $(".user-card-follower").find("span").text(selectedUser.followercount);
  $(".user-card-following").find("span").text(selectedUser.followingcount);
  if (loggedInUser) {
    if (loggedInUser.seq === selectedUser.seq) {
      $(".user-card-mungpoint").append(`
        <div>잔여포인트 ${selectedUser.mungpoint.toLocaleString()} P</div>
      `);
      $(".user-card-button").text("프로필수정");
      $(".user-card-button").addClass("edit");
    } else if (selectedUser.isfollow) {
      $(".user-card-button").text("팔로잉");
      $(".user-card-button").addClass("following");
    } else {
      $(".user-card-button").text("팔로우");
      $(".user-card-button").addClass("follow");
    }
    $(".user-card-button").click((e) => {
      if (e.target.classList[1] === "edit") {
        location.href = "../user/editprofile.html";
      } else {
        if (loggedInUser) {
          $.ajax({
            url: "http://localhost:3000/feed/follow",
            xhrFields: { withCredentials: true },
            crossDomain: true,
            type: "post",
            data: {
              follow_give: loggedInUser.seq,
              follow_recv: selectedUser.seq,
            },
            success: (resp) => {
              if (resp === "follow") {
                $(".user-card-button").text("팔로잉");
                $(".user-card-button").removeClass("follow");
                $(".user-card-button").addClass("following");
              } else {
                $(".user-card-button").text("팔로우");
                $(".user-card-button").removeClass("following");
                $(".user-card-button").addClass("follow");
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
      }
    });
  } else {
    $(".user-card-button").text("팔로우");
    $(".user-card-button").addClass("follow");
    $(".user-card-button").click(() => {
      if (confirm("로그인이 필요합니다. 로그인하시겠습니까?")) {
        location.href = "../user/login.html";
      }
    });
  }
  $(".follower").click(() => {});
  $(".following").click(() => {});
});
