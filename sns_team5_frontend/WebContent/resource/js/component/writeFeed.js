$(document).ready(() => {
  $(".writeFeed").append(`
      <div class="dropdown-write-button">
        <i class="far fa-edit"></i>
        글쓰기
      </div>
      <div class="write-dropdown">
        <div class="write-dropdown-item" onclick="location.href='../sns/write-photo.html'">
          <div class="write-dropdown-item_icon"><i class="fas fa-camera-retro"></i></div>
          <div class="write-dropdown-item_content">
            <div class="item_title">사진 올리기</div>
            <div class="item_content">반려동물의 소식을 알려주세요</div>
          </div>
        </div>
        <div class="write-dropdown-item" onclick="location.href='../sns/write-knowhow.html'">
          <div class="write-dropdown-item_icon"><i class="far fa-lightbulb"></i></div>
          <div class="write-dropdown-item_content">
            <div class="item_title">노하우 글쓰기</div>
            <div class="item_content">자신만의 노하우를 공유해주세요</div>
          </div>
        </div>
        <div class="write-dropdown-item" onclick="location.href='../sns/write-review.html'">
          <div class="write-dropdown-item_icon"><i class="far fa-thumbs-up"></i></div>
          <div class="write-dropdown-item_content">
            <div class="item_title">상품 리뷰 쓰기</div>
            <div class="item_content">상품 후기를 공유해주세요</div>
          </div>
        </div>
        <div class="write-dropdown-item" onclick="location.href='../sns/write-bbs.html'">
          <div class="write-dropdown-item_icon"><i class="far fa-comments"></i></div>
          <div class="write-dropdown-item_content">
            <div class="item_title">이야기</div>
            <div class="item_content">자유롭게 글을 작성해보세요</div>
          </div>
        </div>
      </div>
    `);

  $(".dropdown-write-button").click(() => {
    if ($(".write-dropdown").css("display") === "none") {
      $(".write-dropdown").css("display", "block");
    } else {
      $(".write-dropdown").css("display", "none");
    }
  });
});
