$(document).ready(() => {
  const url = new URL(location.href);
  const urlParams = url.searchParams;
  const content = urlParams.get("content");
  // 선택된 유저가 나인지 아닌지 판단해서 nav바를 만들어줌
  let ajaxIsRun = true;
  let login = loggedInUser ? loggedInUser.seq : 0;

  //시간계산
  const displayedAt = (createdAt) => {
    const milliSeconds = new Date() - new Date(createdAt);
    const seconds = milliSeconds / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;
    const months = days / 30;
    if (months < 12) return `${Math.floor(months)}개월`;
    const year = days / 365;
    return `${Math.floor(year)}살`;
    //if (days < 7) return createdAt.substring(2, createdAt.indexOf(" "));
  };
  if (loggedInUser.seq === selectedUser.seq) {
    $(".user-nav").append(`
    <li id="user-navlist_home" class="active">
      <a href="#" id="user-nav_home" class="active">마이홈</a>
    </li>
    <li id="user-navlist_pet">
      <a href="#" id="user-nav_pet">반려동물</a>
    </li>
    <li id="user-navlist_bbs">
      <a href="#" id="user-nav_bbs">게시글</a>
    </li>
    <li id="user-navlist_like">
      <a href="#" id="user-nav_like">좋아요</a>
    </li>
    <li id="user-navlist_orderlist">
      <a href="#" id="user-nav_orderlist">주문목록</a>
    </li>
    `);
  } else {
    $(".user-nav").append(`
    <li id="user-navlist_home" class="active">
      <a href="#" id="user-nav_home" class="active">마이홈</a>
    </li>
    <li id="user-navlist_pet">
      <a href="#" id="user-nav_pet">반려동물</a>
    </li>
    <li id="user-navlist_bbs">
      <a href="#" id="user-nav_bbs">게시글</a>
    </li>
    <li id="user-navlist_like">
      <a href="#" id="user-nav_like">좋아요</a>
    </li>
    `);
  }

  const getLikeFeed = () => {
    $.ajax({
      url: "http://localhost:3000/feed/getlikefeed",
      type: "get",
      xhrFields: { withCredentials: true },
      crossDomain: true,
      async: false,
      data: {
        userid: selectedUser.seq,
      },
      success: (resp) => {
        console.log(resp);
        let feedType;

        $(".user-detail-content").append(
          `
          <div class="user-detail-title-wrap">
            <div>좋아요<span>${resp.length}</span></div>
          </div>
          <div class="user-detail-like-wrap">
          </div>
        `
        );
        for (i = 0; i < resp.length; i++) {
          if (resp[i].groupno === 1) {
            feedType = "노하우";
          } else if (resp[i].groupno === 2) {
            feedType = "리뷰";
          } else if (resp[i].groupno === 3) {
            feedType = "이야기";
          } else {
            feedType = "사진";
          }
          $(`.user-detail-like-wrap`).append(`
          <div class="user-detail-main-wrap">
            <div class="user-detail-image-wrap photo" onclick="location.href='../sns/${
              resp[i].groupno === 4 ? "photo" : "bbs"
            }detail.html?seq=${resp[i].seq}&userid=${resp[i].userid}'">
              <div class="type">${feedType}</div>
              <img src="${resp[i].file.split("?")[0]}" />
            </div>
          </div>
        `);
        }
      },
      error: () => {},
    });
  };

  const getPhotos = (groupno, page) => {
    if (ajaxIsRun) {
      ajaxIsRun = false;
      const pageArr = ["knowhow", "review", "bbs", "photo"];
      const title = ["노하우", "리뷰", "이야기", "사진"];
      let mainLength = 4;
      if (groupno === 4) {
        mainLength = 8;
      }
      $.ajax({
        url: "http://localhost:3000/feed/getUserFeed",
        type: "get",
        xhrFields: { withCredentials: true },
        crossDomain: true,
        async: false,
        data: {
          groupno,
          userid: selectedUser.seq,
        },
        success: function (resp) {
          console.log(resp);
          if (page === "home") {
            if (resp.length !== 0) {
              $(".user-detail-content").append(
                `
                <div class="user-detail-title-wrap">
                  <div>${title[groupno - 1]}<span>${resp.length}</span></div>
                </div>
                <div class="user-detail-${pageArr[groupno - 1]}-wrap">
                </div>
              `
              );
            }
            if (resp.length === 0) {
            } else if (resp.length < mainLength + 1) {
              for (i = 0; i < mainLength; i++) {
                if (resp[i]) {
                  $(`.user-detail-${pageArr[groupno - 1]}-wrap`).append(`
                  <div class="user-detail-main-wrap">
                    <div class="user-detail-image-wrap ${
                      groupno === 4 ? "photo" : ""
                    }" onclick="location.href='../sns/${
                    groupno === 4 ? "photo" : "bbs"
                  }detail.html?seq=${resp[i].seq}&userid=${resp[i].userid}'">
                      ${
                        groupno === 4
                          ? resp[i].file.split("?").length > 1
                            ? '<i class="fas fa-clone"></i>'
                            : ""
                          : ""
                      }
                      <img src="${resp[i].file.split("?")[0]}" />
                    </div>
                    ${
                      groupno === 4
                        ? ""
                        : '<div class="user-detail-main-wrap_cate">' +
                          resp[i].cate +
                          "</div>"
                    }
                    ${
                      groupno === 4
                        ? ""
                        : '<div class="user-detail-main-wrap_title">' +
                          resp[i].title +
                          "</div>"
                    }
                  </div>
                `);
                } else {
                  $(`.user-detail-${pageArr[groupno - 1]}-wrap`).append(`
                  <div class="user-detail-image-wrap empty ${
                    groupno === 4 ? "photo" : ""
                  }""></div>
                `);
                }
              }
            } else {
              for (i = 0; i < mainLength; i++) {
                if (i === mainLength - 1) {
                  $(`.user-detail-${pageArr[groupno - 1]}-wrap`).append(`
                <div class="user-detail-main-wrap">
                  <div class="user-detail-image-wrap ${
                    groupno === 4 ? "photo" : ""
                  }">
                    ${
                      groupno === 4
                        ? resp[i].file.split("?").length > 1
                          ? '<i class="fas fa-clone"></i>'
                          : ""
                        : ""
                    }
                    <img src="${resp[i].file.split("?")[0]}" />
                    <div data-page="${
                      pageArr[groupno - 1]
                    }" class="user-detail-image-filter">+${
                    resp.length - (mainLength - 1)
                  }</div>
                </div>
              `);
                } else {
                  $(`.user-detail-${pageArr[groupno - 1]}-wrap`).append(`
                <div class="user-detail-main-wrap">
                  <div class="user-detail-image-wrap ${
                    groupno === 4 ? "photo" : ""
                  }" onclick="location.href='../sns/${
                    resp === 4 ? "photo" : "bbs"
                  }detail.html?seq=${resp[i].seq}&userid=${resp[i].userid}'">
                    ${
                      groupno === 4
                        ? resp[i].file.split("?").length > 1
                          ? '<i class="fas fa-clone"></i>'
                          : ""
                        : ""
                    }
                    <img src="${resp[i].file.split("?")[0]}" />
                  </div>
                  ${
                    groupno === 4
                      ? ""
                      : '<div class="user-detail-main-wrap_cate">' +
                        resp[i].cate +
                        "</div>"
                  }
                  ${
                    groupno === 4
                      ? ""
                      : '<div class="user-detail-main-wrap_title">' +
                        resp[i].title +
                        "</div>"
                  }
                </div>
              `);
                }
              }
              $(".user-detail-image-filter").click((e) => {
                $(".user-nav").find("li").removeClass("active");
                $(".user-nav").find("li a").removeClass("active");
                $("#user-nav_bbs").addClass("active");
                $(`#user-navlist_bbs`).addClass("active");
                $(".user-detail-content").html("");
                $(".user-detail-content").append(`
                  <div class="user-detail-main_btns">
                    <div class="user-detail-main_btns-photo">사진</div><div class="user-detail-main_btns-bbs">이야기</div><div class="user-detail-main_btns-review">리뷰</div><div class="user-detail-main_btns-knowhow">노하우</div>
                  </div>
                `);

                $(`.user-detail-main_btns-${e.target.dataset.page}`).addClass(
                  "active"
                );

                let data = null;
                $(".user-detail-main_btns")
                  .find("div")
                  .click((e) => {
                    data = $(".user-detail-main_btns").detach();
                    $(".user-detail-content").html("");
                    $(".user-detail-content").append(data);
                    $(".user-detail-main_btns")
                      .find("div")
                      .removeClass("active");
                    e.target.classList.add("active");
                    if (e.target.innerText === "사진") {
                      getPhotos(4, "photo");
                    } else if (e.target.innerText === "이야기") {
                      getPhotos(3, "bbs");
                    } else if (e.target.innerText === "리뷰") {
                      getPhotos(2, "review");
                    } else {
                      getPhotos(1, "knowhow");
                    }
                  });

                if (e.target.dataset.page === "photo") {
                  getPhotos(4, "photo");
                } else if (e.target.dataset.page === "bbs") {
                  getPhotos(3, "bbs");
                } else if (e.target.dataset.page === "review") {
                  getPhotos(2, "review");
                } else {
                  getPhotos(1, "knowhow");
                }
              });
            }
          } else {
            if (resp.length !== 0) {
              $(".user-detail-content").append(
                `
                <div class="user-detail-title-wrap">
                  <div>${title[groupno - 1]}<span>${resp.length}</span></div>
                </div>
                <div class="user-detail-${pageArr[groupno - 1]}-wrap">
                </div>
              `
              );
              for (i = 0; i < resp.length; i++) {
                $(`.user-detail-${pageArr[groupno - 1]}-wrap`).append(`
                <div class="user-detail-main-wrap">
                  <div class="user-detail-image-wrap ${
                    groupno === 4 ? "photo" : ""
                  }" onclick="location.href='../sns/${
                  resp === 4 ? "photo" : "bbs"
                }detail.html?seq=${resp[i].seq}&userid=${resp[i].userid}'">
                    ${
                      groupno === 4
                        ? resp[i].file.split("?").length > 1
                          ? '<i class="fas fa-clone"></i>'
                          : ""
                        : ""
                    }
                    <img src="${resp[i].file.split("?")[0]}" />
                  </div>
                  ${
                    groupno === 4
                      ? ""
                      : '<div class="user-detail-main-wrap_cate">' +
                        resp[i].cate +
                        "</div>"
                  }
                  ${
                    groupno === 4
                      ? ""
                      : '<div class="user-detail-main-wrap_title">' +
                        resp[i].title +
                        "</div>"
                  }
                </div>
              `);
              }
            }
          }
        },
        error: function () {
          console.log("error");
        },
      });
    }
    ajaxIsRun = true;
  };

  $(".user-nav")
    .find("li a")
    .click((e) => {
      $(".user-nav").find("li").removeClass("active");
      $(".user-nav").find("li a").removeClass("active");

      $(`#${e.target.id}`).addClass("active");
      $(`#user-navlist_${e.target.id.split("_")[1]}`).addClass("active");

      $(".user-detail-content").html("");
      if (e.target.id.split("_")[1] === "home") {
        getPhotos(4, "home");
        getPhotos(3, "home");
        getPhotos(2, "home");
        getPhotos(1, "home");
      } else if (e.target.id.split("_")[1] === "pet") {
        $(".user-detail-content").append(`
          <div class="pet-profile_wrap"></div>
        `);
        $.ajax({
          url: "http://localhost:3000/profile/getpet",
          type: "get",
          data: { userid: selectedUser.seq },
          success: function (resp) {
            console.log(resp);
            if (resp.length === 0) {
              $(".pet-profile_wrap").append(
                `<div class="pet-profile_empty">등록된 반려동물이 없습니다.</div>`
              );
            } else {
              resp.forEach((pet) => {
                let delbtn = "";
                if (login === selectedUser.seq) {
                  delbtn = `
                  <div class="pet-profile_btn" data-seq="${pet.seq}">정보삭제</div>
                  `;
                }
                $(".pet-profile_wrap").append(`
                  <div class="pet-profile">
                    <div class="pet-profile_img-wrap">
                      <img src="${pet.photo}">
                    </div>
                    <div class="pet-profile_breed">${pet.breed}</div>
                    <div class="pet-profile_title">
                      <div class="pet-profile_title-gender">${
                        pet.gender === "수컷"
                          ? '<i class="fas fa-mars"></i>'
                          : '<i class="fas fa-venus"></i>'
                      }</div>
                      <div class="pet-profile_title-name">${pet.name}</div>
                    </div>
                    <div class="pet-profile_state">
                      <div>${displayedAt(pet.birth)}</div>
                      <div>${pet.neuter === 0 ? "중성화완료" : ""}</div>
                    </div>
                    ${delbtn}
                  </div>
                `);
              });

              $(".pet-profile_btn").click((e) => {
                if (login === selectedUser.seq) {
                  if (confirm("이 애완동물 정보를 삭제하시겠습니까?")) {
                    $.ajax({
                      url: "http://localhost:3000/profile/deletepet",
                      type: "post",
                      xhrFields: { withCredentials: true },
                      crossDomain: true,
                      async: false,
                      data: {
                        seq: e.target.dataset.seq,
                      },
                      success: (resp) => {
                        if (resp === "YES") {
                          location.href = `../user/userdetail.html?content=pet&user=${selectedUser.seq}`;
                        } else {
                        }
                      },
                      error: () => {
                        alert("error");
                      },
                    });
                  }
                }
              });
            }
          },
          error: function () {
            alert("error");
          },
        });
        if (login === selectedUser.seq) {
          $(".user-detail-content").append(`
          <button class="pet-btn" id="show">애완동물 등록</button>
          <div class="background">
            <div class="window">
              <div class="popup">
                <div class="popup-container">
                  <div class="popup-title">
                    <h2>내 애완동물 등록</h2>
                  </div>
                <form id="form_all">	
                <div class="popup-main">
                  <div class="popup-input-left">
                    <div class="popup-write">
                      <label for="gender" class="necessary">성별</label>
                      <div class="radio">
                        <input type="radio" id="gender" name="gender" value="수컷"> 수컷
                      </div>
                      <div class="radio">
                        <input type="radio" id="gender" name="gender" value="암컷"> 암컷
                      </div>
                    </div>
                    <div class="popup-write">
                      <label for="neuter" class="necessary">중성화</label>
                      <div class="radio">
                        <input type="radio" id="neuter" name="neuter" value="0"> 예
                      </div>
                      <div class="radio">
                        <input type="radio" id="neuter" name="neuter" value="1"> 아니오
                      </div>
                    </div>
                    <div class="popup-write">
                      <label for="" class="necessary">품종</label>
                      <input type="text" id="breed" name="breed">
                    </div>
                    <div class="popup-write">
                      <label for="name" class="necessary">이름</label>
                      <input type="text" id="name" name="name">
                    </div>
                    <div class="popup-write">
                      <label for="name" class="necessary">생일</label><br>
                      <div class="select">
                      <select id="year">
                        <option selected="selected">년도</option>
                        <option value="2021">2021</option>
                        <option value="2020">2020</option>
                        <option value="2019">2019</option>
                        <option value="2018">2018</option>
                        <option value="2017">2017</option>
                        <option value="2016">2016</option>
                        <option value="2015">2015</option>
                        <option value="2014">2014</option>
                        <option value="2013">2013</option>
                        <option value="2012">2012</option>
                        <option value="2011">2011</option>
                        <option value="2010">2010</option>
                        <option value="2009">2009</option>
                        <option value="2008">2008</option>
                        <option value="2007">2007</option>
                        <option value="2006">2006</option>
                        <option value="2005">2005</option>
                        <option value="2004">2004</option>
                        <option value="2003">2003</option>
                        <option value="2002">2002</option>
                        <option value="2001">2001</option>
                        <option value="2000">2000</option>
                      </select>
                      </div>
                      <div class="select">
                      <select id="month">
                        <option selected="selected">월</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                      </select>
                      </div class="select">
                      <div class="select">
                        <select id="day">
                          <option>일</option>
                        </select>
                      </div>
                    </div>
                    <div class="popup-write">
                      <label for="name" class="necessary">몸무게</label>
                      <input type="text" id="weight" name="weight">
                    </div>
                  </div>
                  <div class="popup-input-right">
                    <div class="popup-content-photo">
                      <label for="thumbnail-input" class="necessary">사진</label>
                      <input
                        type="file"
                        id="thumbnail-input"
                        name="uploadFile"
                        accept="image/*"
                      />
                      <div id="thumbnail-photo">
                        <i class="far fa-image"></i>
                        미리보기
                      </div>
                    </div>
                    <div class="popup-content">
                      <label for="name">특이사항</label>
                      <textarea rows="10px" cols="55px" placeholder="특징을 입력해 주세요"></textarea>
                    </div>
                  <div class="btnbtn">
                    <button class="pet-btn" id="close">팝업닫기</button>
                    <button class="pet-btn" id="btn_write" >등록하기</button>
                  </div>
                  </div>
                </div>
                </form>
                </div>
              </div>
            </div>
          </div>
          `);

          function handleImgFileSelect(e) {
            var files = e.target.files;
            var filesArr = Array.prototype.slice.call(files);

            filesArr.forEach(function (f) {
              sel_file = f;

              var reader = new FileReader();
              reader.onload = function (e) {
                $("#thumbnail-photo").html("");
                $("#thumbnail-photo").append(`
                  <img src="${e.target.result}">
                `);
              };
              reader.readAsDataURL(f);
            });
          }

          $("#thumbnail-photo").click(() => {
            $("#thumbnail-input").click();
          });
          $("#thumbnail-input").on("change", handleImgFileSelect);

          function show(e) {
            e.preventDefault();
            document.querySelector(".background").className = "background show";
          }

          function close(e) {
            e.preventDefault();
            document.querySelector(".background").className = "background";
          }

          document.querySelector("#show").addEventListener("click", show);
          document.querySelector("#close").addEventListener("click", close);

          /* select 일수 불러오기 */
          $("#month").click(() => {
            let year = $("#year").val();
            let month = $("#month").val();

            let day = new Date(year, month, 0).getDate();
            //	console.log(day);
            for (x = 1; x <= day; x++) {
              let str = "<option value=" + x + ">" + x + "</option>";
              $("#day").append(str);
            }
          });

          $("#btn_write").click(function (e) {
            e.preventDefault();
            let formData = new FormData($("#form_all")[0]);
            let result = "";
            let year = $("#year").val();
            let month = $("#month").val();
            let day = $("#day").val();
            result += year;
            result += "-";
            result += month;
            result += "-";
            result += day;
            //	let radioval = $('input[name="gender"]:checked').val();
            //	console.log(radioval);
            formData.append("birth", result);
            formData.append("userid", login);

            $.ajax({
              url: "http://localhost:3000/profile/addpet",
              type: "post",
              data: formData,
              enctype: "multipart/form-data",
              processData: false,
              contentType: false,
              cash: false,
              xhrFields: { withCredentials: true },
              crossDomain: true,
              success: function (msg) {
                location.href = `../user/userdetail.html?content=pet&user=${selectedUser.seq}`;
              },
              error: function () {
                alert("error");
              },
            });
          });
        }
      } else if (e.target.id.split("_")[1] === "bbs") {
        $(".user-detail-content").append(`
          <div class="user-detail-main_btns">
            <div class="user-detail-main_btns-photo active">사진</div><div class="user-detail-main_btns-bbs">이야기</div><div class="user-detail-main_btns-review">리뷰</div><div class="user-detail-main_btns-knowhow">노하우</div>
          </div>
        `);
        getPhotos(4, "photo");
        let data = null;
        $(".user-detail-main_btns")
          .find("div")
          .click((e) => {
            data = $(".user-detail-main_btns").detach();
            $(".user-detail-content").html("");
            $(".user-detail-content").append(data);
            $(".user-detail-main_btns").find("div").removeClass("active");
            e.target.classList.add("active");
            if (e.target.innerText === "사진") {
              getPhotos(4, "photo");
            } else if (e.target.innerText === "이야기") {
              getPhotos(3, "bbs");
            } else if (e.target.innerText === "리뷰") {
              getPhotos(2, "review");
            } else {
              getPhotos(1, "knowhow");
            }
          });
      } else if (e.target.id.split("_")[1] === "like") {
        getLikeFeed();
      } else if (e.target.id.split("_")[1] === "orderlist") {
        if (!loggedInUser) {
          location.href = "../sns/main.html";
        }
        const makeOrderList = (seq) => {
          $(".user-detail-content").html("");
          console.log("orderlist");
          if (seq === 0) {
            $(".user-detail-content").append(`
              <div class="order-status-title">주문 배송 현황</div>
              <div class="order-status">
                <div>
                  <span id="orderstatus-0">0</span><span>결제완료</span>
                </div>
                <i class="fas fa-chevron-right"></i>
                <div>
                  <span id="orderstatus-1">0</span><span>상품준비</span>
                </div>
                <i class="fas fa-chevron-right"></i>
                <div>
                  <span id="orderstatus-2">0</span><span>배송중</span>
                </div>
                <i class="fas fa-chevron-right"></i>
                <div>
                  <span id="orderstatus-3">0</span><span>배송완료</span>
                </div>
              </div>
              <div class="order-orderlist-title">주문내역</div>
              <div class="orderlist_wrap"></div>
          `);

            $.ajax({
              url: "http://localhost:3000/orders/all",
              type: "get",
              data: { seq: loggedInUser.seq },
              xhrFields: { withCredentials: true },
              crossDomain: true,
              success: function (orderlist) {
                console.log(orderlist);
                $.each(orderlist, (i, item) => {
                  console.log($(`#orderstatus-${item.orderstatus}`).text());
                  $(`#orderstatus-${item.orderstatus}`).text(
                    Number.parseInt(
                      $(`#orderstatus-${item.orderstatus}`).text()
                    ) + 1
                  );
                  const orderstatus = $(`#orderstatus-${item.orderstatus}`)
                    .next()
                    .text();
                  $(".orderlist_wrap").append(`
                    <div class='orderlist_wrap-item'>
                      <div class='orderlist_wrap-item_header'>
                        <div class='orderlist_wrap-item_date'>
                          <div>${item.orderdate
                            .split(" ")[0]
                            .replace("-", ". ")
                            .replace("-", ". ")} 주문</div>
                            <div> | ${orderstatus}</div>
                        </div>
                        <div data-seq="${
                          item.seq
                        }" class='orderlist_wrap-item_link'>주문 상세 보기<i class="fas fa-chevron-right"></i></div>
                      </div>
                      <div class="orderlist_wrap-details" id="orderlist_wrap-item_${
                        item.seq
                      }">
                      </div>
                    </div>
                  `);
                  $.ajax({
                    url: "http://localhost:3000/ordersdetail/all",
                    type: "get",
                    data: { orderid: item.seq },
                    xhrFields: { withCredentials: true },
                    crossDomain: true,
                    success: function (orderDetailList) {
                      console.log("orderDetailList", orderDetailList);
                      $.each(orderDetailList, (i, orderdetail) => {
                        console.log("detail");
                        const optionList = orderdetail.selection.split("?");
                        optionTag = "";
                        for (i = 0; i < optionList.length; i++) {
                          optionArr = optionList[i].split("-");
                          if (optionArr[0] !== "") {
                            optionTag += `<span>${optionArr[0]}: ${optionArr[1]}(+${optionArr[2]}원)</span>`;
                          }
                        }
                        $(`#orderlist_wrap-item_${orderdetail.orderid}`)
                          .append(`
                            <div id='orderlist_item-id${
                              orderdetail.orderid
                            }' class="orderlist-details">
                              <div class="orderlist-details-imgwrap">
                                <img src="${orderdetail.thumbnail}">
                              </div>
                              <div class="orderlist-details-main">
                                <div>${orderdetail.name}</div>
                                <div>${orderdetail.totalamount} 원(${
                          orderdetail.quantity
                        }개)</div>
                                <div>
                                  ${optionTag}
                                </div>
                              </div>
                              <div class="orderlist-details-total">${(
                                orderdetail.totalamount * orderdetail.quantity
                              ).toLocaleString()} 원</div>
                            </div>
                        `);
                      });
                    },
                    error: function () {
                      alert("error");
                    },
                  });
                });
                $(".orderlist_wrap-item_link").on("click", (e) => {
                  console.log("click");
                  makeOrderList($(e.target).data("seq"));
                });
              },
              error: function () {
                alert("error");
              },
            });
          } else {
            $.ajax({
              url: "http://localhost:3000/orders/one",
              type: "get",
              data: { seq },
              xhrFields: { withCredentials: true },
              crossDomain: true,
              success: function (order) {
                console.log(order);
                $(".user-detail-content").append(`
                  <div class="orderlist_wrap">
                    <div class="order-orderlist-title">주문정보</div>
                    <div class="order-orderlist-sub">
                      <span>주문일자 </span><span>${order.orderdate
                        .split(" ")[0]
                        .replace("-", ". ")
                        .replace("-", ". ")}</span>
                      <span>주문번호 </span><span>${order.seq}</span>
                    </div>
                    <div class="orderlist_wrap-details" id="orderlist_wrap-item_${
                      order.seq
                    }">
                    </div>
                    <div class="order-orderlist-title">결제정보</div>
                    <div class="order-orderlist-payinfo">
                      <div class="order-orderlist-payinfo_left">
                        <div>
                          <span>상품금액</span><span>${order.productamount.toLocaleString()}원</span>
                        </div>
                        <div>
                          <span>배송비</span><span>${order.deliveryamount.toLocaleString()}원</span>
                        </div>
                        <div>
                          <span>사용포인트</span><span>${order.usemungpoint.toLocaleString()}원</span>
                        </div>
                        <div>
                          <span>적립포인트</span><span>${order.savemungpoint.toLocaleString()}원</span>
                        </div>
                        <div>
                          <span>결제금액</span><span>${order.totalamount.toLocaleString()}원</span>
                        </div>
                      </div>
                      <div class="order-orderlist-payinfo_right">
                        <div>
                          <span>주문자</span><span>${order.orderername}</span>
                        </div>
                        <div>
                          <span>연락처</span><span>${order.ordererphone}</span>
                        </div>
                        <div>
                          <span>이메일</span><span>${order.ordereremail}</span>
                        </div>
                      </div>
                    </div>
                    <div class="order-orderlist-title">배송지정보</div>
                    <div class="order-orderlist-addressinfo"></div>
                  </div>
                  `);
                $.ajax({
                  url: "http://localhost:3000/ordersdetail/all",
                  type: "get",
                  data: { orderid: order.seq },
                  xhrFields: { withCredentials: true },
                  crossDomain: true,
                  async: false,
                  success: function (orderDetailList) {
                    console.log("orderDetailList", orderDetailList);
                    $.each(orderDetailList, (i, orderdetail) => {
                      console.log("detail");
                      const optionList = orderdetail.selection.split("?");
                      optionTag = "";
                      for (i = 0; i < optionList.length; i++) {
                        optionArr = optionList[i].split("-");
                        if (optionArr[0] !== "") {
                          optionTag += `<span>${optionArr[0]}: ${optionArr[1]}(+${optionArr[2]}원)</span>`;
                        }
                      }
                      $(`#orderlist_wrap-item_${orderdetail.orderid}`).append(`
                          <div id='orderlist_item-id${
                            orderdetail.orderid
                          }' class="orderlist-details">
                            <div class="orderlist-details-imgwrap">
                              <img src="${orderdetail.thumbnail}">
                            </div>
                            <div class="orderlist-details-main">
                              <div>${orderdetail.name}</div>
                              <div>${orderdetail.totalamount} 원(${
                        orderdetail.quantity
                      }개)</div>
                              <div>
                                ${optionTag}
                              </div>
                            </div>
                            <div class="orderlist-details-total">${(
                              orderdetail.totalamount * orderdetail.quantity
                            ).toLocaleString()} 원</div>
                          </div>
                      `);
                    });
                  },
                  error: function () {
                    alert("error");
                  },
                });

                $.ajax({
                  url: "http://localhost:3000/address/one",
                  type: "get",
                  data: { seq: order.addressid },
                  xhrFields: { withCredentials: true },
                  crossDomain: true,
                  success: function (address) {
                    console.log(address);
                    $(".order-orderlist-addressinfo").append(`
                    <div class="order-orderlist-addressinfo-main">
                      <div>
                        <span>배송지명</span><span>${address.addressname}</span>
                      </div>
                      <div>
                        <span>받는사람</span><span>${address.receiveuser}</span>
                      </div>
                      <div>
                        <span>받는주소</span><span>${address.address}</span>
                      </div>
                      <div>
                        <span>연락처</span><span>${address.receivephone}</span>
                      </div>
                      <div>
                        <span>요청사항</span><span>${order.ordermessage}</span>
                      </div>
                    </div>
                    `);
                  },
                  error: function () {
                    alert("error");
                  },
                });
              },
              error: () => {
                alert("error");
              },
            });
          }
        };
        makeOrderList(0);
      }
    });

  console.log(`#user-navlist_${content}`);
  $(`#user-nav_${content}`).click();
});
