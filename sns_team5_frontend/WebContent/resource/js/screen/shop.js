$(document).ready(() => {
  const url = new URL(location.href);
  const urlParams = url.searchParams;
  const content = urlParams.get("content");
  let page = 0;
  let catecode = 0;
  let oneTime = false;

  const cateproductReq = (category) => {
    console.log(category);
    $.ajax({
      url: "http://localhost:3000/product/categoryproduct",
      type: "get",
      xhrFields: { withCredentials: true },
      crossDomain: true,
      data: { category, page, groupno: 3 }, // date값 변경하기
      success: function (list) {
        console.log(list);
        if (list.length === 30) {
          oneTime = false;
        } else {
          oneTime = true;
        }
        $(".shop-main-content_main").append(``);
        if (list.length === 0) {
          if (page === 0) {
            $(".shop-main-content_main").append(`
            <div class="shop-main-content_main-empty">등록된 상품이 없습니다.</div>
          `);
          }
        } else {
          $(".shop-main-content_count").text(
            `전체 ${list.length.toLocaleString()}개`
          );
          list.forEach((product) => {
            $(".shop-main-content_main").append(`
              <div class="product-block-item">
                <div class="image-wrap" onclick="location.href='../store/product-detail.html?seq=${
                  product.seq
                }'">
                  <img src="${product.thumbnail}" />
                </div>
                <div class="product-content-wrap">
                  <div>${product.catename}</div>
                  <div class="product-content-wrap_title">
                    ${product.name}
                  </div>
                  <div class="product-content-price">
                    ${
                      product.discount
                        ? "<span class='product-content-price_discount'>" +
                          Math.round(
                            ((product.price - product.discount) /
                              product.price) *
                              100
                          ) +
                          "%</span>"
                        : ""
                    }
                    ${
                      product.discount
                        ? "<span class='product-content-price_now'>" +
                          product.discount.toLocaleString() +
                          "원</span>"
                        : "<span class='product-content-price_now'>" +
                          product.price.toLocaleString() +
                          "원</span>"
                    }
                    ${
                      product.discount
                        ? "<span class='product-content-price_line'>" +
                          product.price.toLocaleString() +
                          "</span>"
                        : ""
                    }
                  </div>
                </div>
              </div>
            `);
          });
        }
        page++;
      },
      error: function () {
        alert("error");
      },
    });
  };

  const createSideList = (type) => {
    $(".shop-side-menu").append(`
      <a class="all-select" data-code="${type === "cat" ? 2000 : 1000}">전체</a>
      <ul class="side-menu-wrap">
        <li class="side-menu-item">
          <div class="side-menu-item_title">
            <div>사료</div>
            <i class="fas fa-chevron-down"></i>
          </div>
          <ul class="side-menu-detail-list">
            <li data-code="${type === "cat" ? 2100 : 1100}">- 전체</li>
            <li data-code="${type === "cat" ? 2101 : 1101}">${
      type === "cat" ? "- 키튼" : "- 퍼피"
    }(~12개월)</li>
            <li data-code="${type === "cat" ? 2102 : 1102}">- 어덜트(1~7세)</li>
            <li data-code="${
              type === "cat" ? 2103 : 1103
            }">- 시니어(7세이상)</li>
            <li data-code="${type === "cat" ? 2104 : 1104}">- 전연령</li>
            <li data-code="${type === "cat" ? 2105 : 1105}">- 건식</li>
            <li data-code="${type === "cat" ? 2106 : 1106}">- 습식</li>
            <li data-code="${type === "cat" ? 2107 : 1107}">- 에어/동결</li>
            <li data-code="${type === "cat" ? 2108 : 1108}">${
      type === "cat" ? "- 파우치" : "- 자연식/화식"
    }</li>
          </ul>
        </li>
        <li class="side-menu-item">
          <div class="side-menu-item_title">
            <div>간식</div>
            <i class="fas fa-chevron-down"></i>
          </div>
          <ul class="side-menu-detail-list">
            <li data-code="${type === "cat" ? 2200 : 1200}">- 전체</li>
            <li data-code="${type === "cat" ? 2201 : 1201}">${
      type === "cat" ? "- 수제간식" : "- 껌"
    }</li>
            <li data-code="${
              type === "cat" ? 2202 : 1202
            }">- 동결/건조/트릿</li>
            <li data-code="${type === "cat" ? 2203 : 1203}">${
      type === "cat" ? "- 사시미/저키/스틱" : "- 사시미/육포/저키"
    }</li>
            <li data-code="${type === "cat" ? 2204 : 1204}">${
      type === "cat" ? "- 캣닢/캣그라스" : "- 수제간식"
    }</li>
            <li data-code="${type === "cat" ? 2205 : 1205}">- 캔파우치</li>
            <li data-code="${type === "cat" ? 2206 : 1206}">${
      type === "cat" ? "- 음료" : "- 비스킷/빵/케이크"
    }</li>
            <li data-code="${type === "cat" ? 2207 : 1207}">${
      type === "cat" ? "- 스낵" : "- 기타간식"
    }</li>
          </ul>
        </li>
        <li class="side-menu-item">
          <div class="side-menu-item_title">
            <div>케어</div>
            <i class="fas fa-chevron-down"></i>
          </div>
          <ul class="side-menu-detail-list">
            <li data-code="${type === "cat" ? 2300 : 1300}">- 전체</li>
            <li data-code="${type === "cat" ? 2301 : 1301}">- 영양제</li>
            <li data-code="${type === "cat" ? 2302 : 1302}">- 위생</li>
            <li data-code="${type === "cat" ? 2303 : 1303}">- 미용/목욕</li>
            <li data-code="${type === "cat" ? 2304 : 1304}">- 배변</li>
            <li data-code="${type === "cat" ? 2305 : 1305}">${
      type === "cat" ? "- 구강관리" : "- 눈/귀관리"
    }</li>
          </ul>
        </li>
        <li class="side-menu-item">
          <div class="side-menu-item_title">
            <div>리빙</div>
            <i class="fas fa-chevron-down"></i>
          </div>
          <ul class="side-menu-detail-list">
            <li data-code="${type === "cat" ? 2400 : 1400}">- 전체</li>
            <li data-code="${type === "cat" ? 2401 : 1401}">- 안전문/울타리</li>
            <li data-code="${type === "cat" ? 2402 : 1402}">- 하우스/방석</li>
            <li data-code="${type === "cat" ? 2403 : 1403}">- 급식기/급수기</li>
            ${type === "cat" ? '<li data-code="2404">- 캣타워</li>' : ""}
            ${type === "cat" ? '<li data-code="2405">- 매트/침대</li>' : ""}
            ${type === "cat" ? '<li data-code="2406">- 사료통/사료샆</li>' : ""}
          </ul>
        </li>
        <li class="side-menu-item">
          <div class="side-menu-item_title">
            <div>외출</div>
            <i class="fas fa-chevron-down"></i>
          </div>
          <ul class="side-menu-detail-list">
            <li data-code="${type === "cat" ? 2500 : 1500}">- 전체</li>
            <li data-code="${type === "cat" ? 2501 : 1501}">- 이동장/유모차</li>
            <li data-code="${
              type === "cat" ? 2502 : 1502
            }">- 가슴줄/리드줄/하네스</li>
            <li data-code="${type === "cat" ? 2503 : 1503}">- 목걸이/인식표</li>
            <li data-code="${type === "cat" ? 2504 : 1504}">- 카시트/캐리어</li>
            ${type === "dog" ? '<li data-code="1505">- 입마개</li>' : ""}
          </ul>
        </li>
        <li class="side-menu-item">
          <div class="side-menu-item_title">
            <div>장난감</div>
            <i class="fas fa-chevron-down"></i>
          </div>
          <ul class="side-menu-detail-list">
            <li data-code="${type === "cat" ? 2600 : 1600}">- 전체</li>
            <li data-code="${type === "cat" ? 2601 : 1601}">${
      type === "cat" ? "- 낚시대/레이져" : "- 노즈워크"
    }</li>
            <li data-code="${type === "cat" ? 2602 : 1602}">${
      type === "cat" ? "- 공/인형/쿠션" : "- 훈련"
    }</li>
            <li data-code="${type === "cat" ? 2603 : 1603}">${
      type === "cat" ? "- 스크래쳐" : "- 장난감/토이"
    }</li>
            ${type === "cat" ? '<li data-code="2604">- 터널/박스</li>' : ""}
            ${type === "cat" ? '<li data-code="2605">- 자동장난감</li>' : ""}
          </ul>
        </li>
        <li class="side-menu-item">
          <div class="side-menu-item_title">
            <div>패션</div>
            <i class="fas fa-chevron-down"></i>
          </div>
          <ul class="side-menu-detail-list">
            <li data-code="${type === "cat" ? 2700 : 1700}">- 전체</li>
            <li data-code="${type === "cat" ? 2701 : 1701}">- 의류</li>
            <li data-code="${type === "cat" ? 2702 : 1702}">- 악세서리/가방</li>
            <li data-code="${type === "cat" ? 2703 : 1703}">- 디자인소품</li>
          </ul>
        </li>
      </ul>
    `);
  };

  // $.ajax({
  //   url: "http://localhost:3000/product/choiceproduct",
  //   type: "get",
  //   data: { userid: 1, order: 0 }, // date값 변경하기
  //   success: function (list) {},
  //   error: function () {
  //     alert("error");
  //   },
  // });

  createSideList(content);

  $(".side-menu-item_title").click((e) => {
    if (
      $(e.target).parent().next(".side-menu-detail-list").css("display") ===
      "block"
    ) {
      e.target.parentNode
        .querySelector("i")
        .classList.replace("fa-chevron-up", "fa-chevron-down");

      $(".side-menu-detail-list").css("display", "none");
    } else {
      let icons = document.querySelectorAll(".side-menu-item_title");
      console.log(icons.length);
      for (i = 0; i < icons.length; i++) {
        icons[i]
          .querySelector("i")
          .classList.replace("fa-chevron-up", "fa-chevron-down");
      }
      e.target.parentNode
        .querySelector("i")
        .classList.replace("fa-chevron-down", "fa-chevron-up");
      $(".side-menu-detail-list").css("display", "none");
      $(e.target)
        .parent()
        .next(".side-menu-detail-list")
        .css("display", "block");
    }
  });

  $(".side-menu-detail-list")
    .find("li")
    .click((e) => {
      page = 0;
      $(".shop-main-content_main").html("");
      cateproductReq($(e.target).data("code"));
      catecode = $(e.target).data("code");
      //console.log($(e.target).data("code"));
      //console.log($(e.target).text());
      // $(e.target).html("");
    });

  $(".all-select").click((e) => {
    $(".shop-main-content_main").html("");
    catecode = $(e.target).data("code");
    page = 0;
    cateproductReq($(e.target).data("code"));
  });

  cateproductReq(content === "cat" ? 2000 : 1000);
  catecode = content === "cat" ? 2000 : 1000;

  window.onscroll = function (e) {
    //window height + window scrollY 값이 document height보다 클 경우,
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight &&
      !oneTime
    ) {
      oneTime = true;
      console.log(catecode);
      cateproductReq(catecode);
    }
  };
});
