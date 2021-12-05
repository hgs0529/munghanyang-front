$(document).ready(() => {
  const url = new URL(location.href);
  const urlParams = url.searchParams;
  const seq = urlParams.get("seq");
  let starScore = 0;

  //시간계산
  const displayedAt = (createdAt) => {
    console.log(createdAt);
    const milliSeconds = new Date() - new Date(createdAt);
    const seconds = milliSeconds / 1000;
    if (seconds < 60) return "방금 전";
    const minutes = seconds / 60;
    if (minutes < 60) return Math.floor(minutes) + "분 전";
    const hours = minutes / 60;
    if (hours < 24) return Math.floor(hours) + "시간 전";
    const days = hours / 24;
    return createdAt.substring(2, createdAt.indexOf(" "));
  };
  //상품정보
  $.ajax({
    url: "http://localhost:3000/product/getproductdetail",
    type: "get",
    xhrFields: { withCredentials: true },
    crossDomain: true,
    data: { userid: loggedInUser ? loggedInUser.seq : 0, seq }, //맞게 변경 해야함 !!
    success: function (product) {
      console.log(product);
      const cateCode = product.categorycode.toString();
      const lineMap1 = cateCode[0] === "1" ? "강아지" : "고양이";
      let lineMap2;
      switch (cateCode[1]) {
        case "1":
          lineMap2 = "사료";
          break;
        case "2":
          lineMap2 = "간식";
          break;
        case "3":
          lineMap2 = "케어";
          break;
        case "4":
          lineMap2 = "리빙";
          break;
        case "5":
          lineMap2 = "외출";
          break;
        case "6":
          lineMap2 = "장난감";
          break;
        case "7":
          lineMap2 = "패션";
          break;
      }
      $.ajax({
        url: "http://localhost:3000/product/getcatename",
        type: "get",
        xhrFields: { withCredentials: true },
        crossDomain: true,
        data: { catecode: product.categorycode },
        success: function (catename) {
          console.log(catename);
          $(".product-linemap").append(`
              <span>${lineMap1} > </span>
              <span>${lineMap2} > </span>
              <span>${catename}</span>
            `);
          $(".product-overview-main-imagewrap").append(`
              <img src="${product.thumbnail}">
            `);
          $(".overview-main-info_title").text(product.name);
          $(".overview-main-info_price").append(`
            ${
              product.discount
                ? "<div class='main-info_price_persent'>" +
                  Math.round(
                    ((product.price - product.discount) / product.price) * 100
                  ) +
                  "%</div>"
                : ""
            }
            ${
              product.discount
                ? "<div class='main-info_price_now'>" +
                  product.discount.toLocaleString() +
                  "원</div>"
                : "<div class='main-info_price_now'>" +
                  product.price.toLocaleString() +
                  "원</div>"
            }
            ${
              product.discount
                ? "<div class='main-info_price_line'>" +
                  product.price.toLocaleString() +
                  "</div>"
                : ""
            }
            <span class='main-info_point'>${(
              ((product.discount ? product.discount : product.price) * 1) /
              100
            ).toLocaleString()}p</span>
            <span class='main-info_pointtext'>적립예정</span>
            `);
          $(".overview-main-info_quantity-right").append(`
              <div id="info_quantity-right_minus"><i class="fas fa-minus"></i></div>
              <input id="info_quantity-right_input" type="text" value="1" readonly>
              <div id="info_quantity-right_plus"><i class="fas fa-plus"></i></div>
            `);
          $(".overview-main-info_sum-right").append(`
              <span class="overview-main-info_sum-right_price">${(product.discount
                ? product.discount
                : product.price
              ).toLocaleString()}</span>
              <span>원</span>
            `);
          let heart;
          if (product.isliked) {
            heart = `<i class="fas fa-heart"></i>`;
          } else {
            heart = `<i class="far fa-heart"></i>`;
          }
          $(".overview-main-info_heart").append(heart);
          $(".product-main-content_main").append(product.content);
          $(".modal-product_main-product_imgwrap").append(`
              <img src='${product.thumbnail}'>
            `);
          $(".modal-product_main-product_title").text(product.name);

          let pay = $(".product-bay");
          let nav = $(".product-main-tabs");
          $(window).scroll(function () {
            if ($(window).scrollTop() > 930) {
              pay.addClass("sidebar");
              nav.addClass("sidebar");
            } else {
              pay.removeClass("sidebar");
              nav.removeClass("sidebar");
            }
            let detailTop = $(".product-main-content_main").offset().top - 400;
            let reviewTop =
              $(".product-main-content_review").offset().top - 400;
            let qnaTop = $(".product-main-content_qna").offset().top - 400;
            let delivery =
              $(".product-main-content_delivery").offset().top - 500;
            if (
              $(document).scrollTop() > detailTop &&
              $(document).scrollTop() < reviewTop
            ) {
              $(".product-main-tabs_tabs").find("div").removeClass("active");
              $(".product-detail").addClass("active");
            } else if (
              $(document).scrollTop() < qnaTop &&
              $(document).scrollTop() > reviewTop
            ) {
              $(".product-main-tabs_tabs").find("div").removeClass("active");
              $(".product-review").addClass("active");
            } else if (
              $(document).scrollTop() > qnaTop &&
              $(document).scrollTop() < delivery
            ) {
              $(".product-main-tabs_tabs").find("div").removeClass("active");
              $(".product-qna").addClass("active");
            } else if ($(document).scrollTop() > delivery) {
              $(".product-main-tabs_tabs").find("div").removeClass("active");
              $(".product-other").addClass("active");
            }
          });
          $(".product-detail").click(() => {
            window.scrollTo({
              top: $(".product-main-content_main").offset().top,
              behavior: "smooth",
            });
          });
          $(".product-review").click(() => {
            window.scrollTo({
              top: $(".product-main-content_review").offset().top,
              behavior: "smooth",
            });
          });
          $(".product-qna").click(() => {
            window.scrollTo({
              top: $(".product-main-content_qna").offset().top,
              behavior: "smooth",
            });
          });
          $(".product-other").click(() => {
            window.scrollTo({
              top: $(".product-main-content_delivery").offset().top,
              behavior: "smooth",
            });
          });
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

          $("#info_quantity-right_plus").click(() => {
            const prevVal = $("#info_quantity-right_input").val();
            $("#info_quantity-right_input").val(Number.parseInt(prevVal) + 1);
            $(".overview-main-info_sum-right_price").text(
              (
                $("#info_quantity-right_input").val() *
                (product.discount ? product.discount : product.price)
              ).toLocaleString()
            );
          });
          $("#info_quantity-right_minus").click(() => {
            const prevVal = $("#info_quantity-right_input").val();
            if (prevVal !== "1") {
              $("#info_quantity-right_input").val(Number.parseInt(prevVal) - 1);
              $(".overview-main-info_sum-right_price").text(
                (
                  $("#info_quantity-right_input").val() *
                  (product.discount ? product.discount : product.price)
                ).toLocaleString()
              );
            }
          });
        },
        error: function () {
          alert("error");
        },
      });
    },
    error: function () {
      alert("error");
    },
  });

  //옵션
  $.ajax({
    url: "http://localhost:3000/product/getoption",
    type: "get",
    xhrFields: { withCredentials: true },
    crossDomain: true,
    data: { productid: seq },

    success: function (option) {
      for (i = 0; i < option.length; i++) {
        if (i === 0 || option[i - 1].title !== option[i].title) {
          $(".overview-main-info_options").append(`
            <select id="info_options-${option[i].seq}">
              <option value='0'>- ${option[i].title} 선택 -</option>
              <option value="${option[i].seq}">${option[i].subtitle}${
            option[i].optionprice === 0
              ? ""
              : "(+" + option[i].optionprice + "원)"
          }</option>
            </select>
            `);
        } else if (option[i - 1].title === option[i].title) {
          while (true) {
            let j = i;
            if (
              $("#info_options-" + option[j - 1].seq)
                .find("option")
                .first()
                .text() === `- ${option[i].title} 선택 -`
            ) {
              $("#info_options-" + option[j - 1].seq).append(`
                  <option value="${option[i].seq}">${option[i].subtitle}${
                option[i].optionprice === 0
                  ? ""
                  : "(+" + option[i].optionprice + "원)"
              }</option>
                `);
              break;
            }
            j--;
          }
        } else {
          $(".overview-main-info_options").append(`
            <select id="info_options-${option[i].seq}">
              <option>${option[i].title}</option>
              <option value="${option[i].seq}">${option[i].subtitle}${
            option[i].optionprice === 0
              ? ""
              : "(+" + option[i].optionprice + "원)"
          }</option>
            </select>
            `);
        }
      }

      $(".overview-main-info_bay").click(() => {
        let optionChk = 0;
        for (i = 0; i < option.length; i++) {
          if (
            $(`#info_options-${option[i].seq}`).val() !== "0" &&
            $(`#info_options-${option[i].seq}`).val()
          ) {
            optionChk++;
          }
        }
        if ($("select").length - 1 !== optionChk) {
          alert("옵션을 선택해 주세요");
        } else {
          let options = "";
          for (i = 0; i < option.length; i++) {
            if (
              $(`#info_options-${option[i].seq}`).val() !== "0" &&
              $(`#info_options-${option[i].seq}`).val()
            ) {
              if (i !== 0) {
                options += "?";
              }
              options += $(`#info_options-${option[i].seq}`).val();
            }
          }
          console.log(options);
          $.ajax({
            url: "http://localhost:3000/cart/addimmediately",
            type: "post",
            xhrFields: { withCredentials: true },
            crossDomain: true,
            data: {
              options,
              userid: loggedInUser.seq,
              productid: seq,
              quantity: $("#info_quantity-right_input").val(),
            },
            success: (msg) => {
              if (msg === "OK") {
                location.href = "../user/order.html";
              }
            },
            error: () => {
              alert("error");
            },
          });
        }
      });

      $(".overview-main-info_cart").click(() => {
        let optionChk = 0;
        for (i = 0; i < option.length; i++) {
          if (
            $(`#info_options-${option[i].seq}`).val() !== "0" &&
            $(`#info_options-${option[i].seq}`).val()
          ) {
            optionChk++;
          }
        }
        if ($("select").length - 1 !== optionChk) {
          alert("옵션을 선택해 주세요");
        } else {
          let options = "";
          for (i = 0; i < option.length; i++) {
            if (
              $(`#info_options-${option[i].seq}`).val() !== "0" &&
              $(`#info_options-${option[i].seq}`).val()
            ) {
              if (i !== 0) {
                options += "?";
              }
              options += $(`#info_options-${option[i].seq}`).val();
            }
          }
          console.log(options);
          $.ajax({
            url: "http://localhost:3000/cart/new",
            type: "post",
            xhrFields: { withCredentials: true },
            crossDomain: true,
            data: {
              options,
              userid: loggedInUser.seq,
              productid: seq,
              quantity: $("#info_quantity-right_input").val(),
            },
            success: (msg) => {
              if (msg === "OK") {
                location.href = "../user/cart.html";
              }
            },
            error: () => {
              alert("error");
            },
          });
        }
      });
    },
    error: function () {
      alert("error");
    },
  });

  const getComments = () => {
    $.ajax({
      url: "http://localhost:3000/product/getcomment",
      type: "get",
      xhrFields: { withCredentials: true },
      crossDomain: true,
      data: { productid: seq },
      success: function (comment) {
        if (comment.length === 0) {
        } else {
          $(".review-stars_review-wrap").html("");
          let scoreObj = {};
          $.each(comment, (i, item) => {
            if (scoreObj[item.star]) {
              scoreObj[item.star] += 1;
            } else {
              scoreObj[item.star] = 1;
            }
            let stars = "";
            for (i = 0; i < item.star; i++) {
              stars += `<i class="fas fa-star"></i>`;
            }
            $(".review-stars_review-wrap").append(`
                <div class="review-stars_review-item">
                  <div class="review-stars-writer">
                    <div class="review-stars-writer_imgwrap">
                      <img src='${item.avatar}'>
                    </div>
                    <div class="review-stars-writer_main">
                      <div class="review-stars-writer_name">${
                        item.nickname
                      }</div>
                      <div class="review-stars-writer_star">
                        <span class="review-stars-writer_score">${stars}</span><span class="review-stars-writer_date">${
              item.cdate.split(" ")[0]
            }</span>
                      </div>
                    </div>
                  </div>
                  <div class="review-main-contents">
                    <div class="review-main-imgwrap">
                      <img src='${item.file}'>
                    </div>
                    <div class="review-main-content">${item.content}</div>
                  </div>
                </div>
              `);
          });
          $(".product-main-content_review-header_reviewcount").text(
            comment.length
          );
          let totalVal = 0;
          let keys = Object.keys(scoreObj);
          for (i = 0; i < keys.length; i++) {
            if (scoreObj[keys[i]] > 1) {
              totalVal +=
                Number.parseInt(keys[i]) * Number.parseInt(scoreObj[keys[i]]);
            } else {
              totalVal += Number.parseInt(keys[i]);
            }
            let persent = (scoreObj[keys[i]] / comment.length) * 100;
            $(`#${keys[i]}-score_progress`).css("width", `${persent}%`);
          }
          let score = Math.round(totalVal / comment.length);
          $(".review-stars_badge").html("");
          $(".overview-main-info_stars").html("");
          for (i = 0; i < score; i++) {
            $(".review-stars_badge").append(`
                <i class="fas fa-star"></i>
              `);
            $(".overview-main-info_stars").append(`
              <i class="fas fa-star"></i>
            `);
          }

          for (i = 0; i < 5 - score; i++) {
            $(".review-stars_badge").append(`
                <i class="far fa-star"></i>
              `);
            $(".overview-main-info_stars").append(`
              <i class="far fa-star"></i>
            `);
          }
          $(".review-stars_badge").append(`
            <span class="avg-score">${(totalVal / comment.length).toFixed(
              1
            )}</span>
          `);
          for (i = 0; i < 5; i++) {
            if (scoreObj[i + 1]) {
              $(`#${i + 1}-score_count`).text(scoreObj[i + 1]);
            } else {
              $(`#${i + 1}-score_count`).text("0");
            }
          }
        }
      },
      error: function () {
        alert("error");
      },
    });
  };
  const dateFormat = (date) => {
    const dateArr = date.split(" ");
    const year = dateArr[0].split("-")[0];
    const month = dateArr[0].split("-")[1];
    const day = dateArr[0].split("-")[2];

    const hours = dateArr[1].split(":")[0];
    const minutes = dateArr[1].split(":")[1];

    return `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes}분`;
  };

  const getQnas = () => {
    $(".product-main-content_qna-main").html("");
    $.ajax({
      url: "http://localhost:3000/admin/product/getask",
      type: "get",
      data: { productid: seq },
      xhrFields: { withCredentials: true },
      crossDomain: true,
      success: function (qnas) {
        console.log(qnas);
        if (qnas.length === 0) {
        } else {
          $(".product-main-content_qna-header_qnacount").text(qnas.length);
          for (i = 0; i < qnas.length; i++) {
            $(".product-main-content_qna-main").append(`
              <div class="product-qna-item" id="qna-parent-${qnas[i].seq}">
                <div class="product-qna-item_header">
                  <span>${qnas[i].asktype}</span><span>|</span><span class="${
              qnas[i].answered ? "answerd" : ""
            }">${qnas[i].answered ? "답변완료" : "미답변"}</span>
                </div>
                <div class="product-qna-item_author">
                  <span>${
                    qnas[i].nickname
                  }</span><span>|</span><span>${dateFormat(
              qnas[i].wdate
            )}</span>
                </div>
                <div class="product-qna-item_question">
                  <div>Q</div>
                  <div>${qnas[i].content}</div>
                </div>
              </div>
            `);
          }

          $.ajax({
            url: "http://localhost:3000/admin/product/getanswer",
            type: "get",
            data: { productid: seq },
            xhrFields: { withCredentials: true },
            crossDomain: true,
            success: function (answers) {
              console.log(answers);
              for (i = 0; i < answers.length; i++) {
                $(`#qna-parent-${answers[i].ref}`).append(`
                  <div class="product-qna-item_answer">
                    <div class="answer-icon">A</div>
                    <div class="product-qna-item_answer-main">
                      <div><span>멍하냥</span><span>${dateFormat(
                        answers[i].wdate
                      )}</span></div>
                      <div>${answers[i].content}</div>
                    </div>
                  </div>
                `);
              }
            },
            error: function () {
              alert("error");
            },
          });
        }
      },
      error: function () {
        alert("error");
      },
    });
  };

  function showReview(e) {
    e.preventDefault();
    document.querySelector(".review-background").className =
      "review-background show";
  }

  function closeReview(e) {
    document.querySelector(".review-background").className =
      "review-background";
  }

  document.querySelector("#show-review").addEventListener("click", showReview);
  document
    .querySelector(".modal-product_main-cancel")
    .addEventListener("click", closeReview);

  function show(e) {
    e.preventDefault();
    document.querySelector(".background").className = "background show";
  }

  function close() {
    document.querySelector(".background").className = "background";
  }

  document.querySelector("#show").addEventListener("click", show);
  document
    .querySelector(".modal-product_qna-cancel")
    .addEventListener("click", close);

  $(".modal-product_main-star")
    .find("i")
    .click((e) => {
      const starLength = Number.parseInt($(e.target).data("val"));
      starScore = starLength;
      for (i = 0; i < 5; i++) {
        if (i < starLength) {
          $(".modal-product_main-star")
            .find("i")
            [i].classList.replace("far", "fas");
        } else {
          $(".modal-product_main-star")
            .find("i")
            [i].classList.replace("fas", "far");
        }
      }
      console.log(starScore);
    });

  $(".modal-product_main-write").click(() => {
    if (loggedInUser) {
      if ($("#modal-product_main-textarea").val() === "") {
        alert("리뷰 내용을 필수사항입니다.");
        $("#modal-product_main-textarea").focus();
      } else {
        const formData = new FormData($("#upload-form")[0]);
        formData.append("content", $("#modal-product_main-textarea").val());
        formData.append("productid", seq);
        formData.append("userid", loggedInUser.seq);
        formData.append("star", starScore);
        console.log(formData.get("content"));

        $.ajax({
          url: "http://localhost:3000/comments/addproduct",
          type: "post",
          data: formData,
          enctype: "multipart/form-data",
          xhrFields: { withCredentials: true },
          crossDomain: true,
          processData: false,
          contentType: false,
          cash: false,
          success: function (msg) {
            console.log(msg);
            closeReview();
            getComments();
          },
          error: function () {
            alert("error");
          },
        });
      }
    } else {
      if (confirm("로그인이 필요합니다 로그인하시겠습니까>?")) {
        location.href = "../user/login.html";
      }
    }
  });

  $(".product-qna-typeBtns")
    .find("div")
    .click((e) => {
      $(".product-qna-typeBtns")
        .find("div")
        .each((i, item) => {
          $(item).removeClass("active");
        });
      $(e.target).addClass("active");
    });

  $(".modal-product_qna-write").click(() => {
    if ($(".product-qna-textarea").val() === "") {
      alert("내용을 입력하지 않았습니다.");
      $(".product-qna-textarea").focus();
    } else {
      console.log($(".product-qna-typeBtns div.active").text());

      $.ajax({
        url: "http://localhost:3000/user/product/ask",
        type: "post",
        data: {
          userid: loggedInUser.seq,
          productid: seq,
          content: $(".product-qna-textarea").val(),
          asktype: $(".product-qna-typeBtns div.active").text(),
        },
        xhrFields: { withCredentials: true },
        crossDomain: true,
        success: function (msg) {
          console.log(msg);
          close();
          getQnas();
        },
        error: function () {
          alert("error");
        },
      });
    }
  });

  getComments();
  getQnas();
});
