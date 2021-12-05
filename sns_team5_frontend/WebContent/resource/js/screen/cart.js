$(document).ready(() => {
  if (!loggedInUser) {
    location.href - "../store/main.html";
  }
  function comma(str) {
    str = String(str);
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,");
  }

  const setQuantity = (quantity, seq) => {
    $.ajax({
      url: "http://localhost:3000/cart/setquantity",
      type: "post",
      xhrFields: { withCredentials: true },
      crossDomain: true,
      data: { seq, quantity },
      async: false,
      success: (list) => {
        console.log(list);
        console.log("수량 변경 성공");
      },
      error: () => {
        alert("error");
      },
    });
  };

  const deleteChkCart = (seq) => {
    $.ajax({
      url: "http://localhost:3000/cart/btndel",
      type: "post",
      xhrFields: { withCredentials: true },
      crossDomain: true,
      async: false,
      data: { seq },
      success: (msg) => {
        console.log(msg);
      },
      error: () => {
        alert("error");
      },
    });
  };

  const getAllCart = (reset) => {
    $(".cart-content-list").html("");
    $.ajax({
      url: "http://localhost:3000/cart/all",
      xhrFields: { withCredentials: true },
      crossDomain: true,
      data: { userid: loggedInUser.seq, resetchk: reset ? 0 : 1 },
      success: (list) => {
        list = list;
        if (list.length === 0) {
          $(".cart-content-list").append(`
            <div class="shop-main-content_main-empty">장바구니가 비었습니다.</div>
          `);
        } else {
          let sumPrice = 0;
          let totalPrice = 0;
          let discountPrice = 0;
          list.forEach((item) => {
            if (item.status === 0) {
              sumPrice += item.discount
                ? item.discount * item.quantity
                : item.price * item.quantity;
              totalPrice += item.price * item.quantity;
              if (item.discount) {
                discountPrice +=
                  item.price * item.quantity - item.discount * item.quantity;
              }
            }
            const options = item.options.split("?");
            let option = "";
            for (i = 0; i < options.length; i++) {
              if (options[i] !== "") {
                const optionName = options[i].split("-")[0];
                const optionValue = options[i].split("-")[1];
                const optionprice = options[i].split("-")[2];
                let val = `${optionName}: ${optionValue}(+${optionprice}원)`;
                option += `<span>${val}</span>`;
              }
            }

            $(".cart-content-list").append(`
              <div class="cart-content-list_item">
                <div class="cart-content-list_chk">
                  <input type="checkbox" ${
                    item.status === 0 ? "checked" : ""
                  } class="cart-chk" data-seq='${item.seq}'>
                </div>
                <div class="cart-content-list_main">
                  <div class="cart-image-wrap">
                    <img src="${item.file}">
                  </div>
                  <div class="cart-item-title">
                    <div>${item.name}</div>
                    <div>${option}</div>
                  </div>
                  <div class="cart-item-pricewrap">
                    <div class="cart-item-quantity">
                      <div class="quantity-btn-down" data-seq='${
                        item.seq
                      }'><i class="fas fa-minus" data-seq='${
              item.seq
            }'></i></div>
                      <div class="cart-item-quantity_quantity" id="cart-quantity-${
                        item.seq
                      }">${item.quantity}</div>
                      <div class="quantity-btn-up" data-seq='${
                        item.seq
                      }'><i class="fas fa-plus" data-seq='${
              item.seq
            }'></i></div>
                    </div>
                    <div class="cart-item-price-wrap">
                      <div class="cart-item-price" id="cart-item-price-${
                        item.seq
                      }">${
              item.discount
                ? comma(item.discount * item.quantity)
                : comma(item.price * item.quantity)
            }</div><span>원</span>
                    </div>
                  </div>
                  <div class="cart-item-del">
                    <i data-seq='${item.seq}' class="fas fa-times"></i>
                  </div>
                </div>
              </div>
            `);
          });
          $(".main_all-sumPrice").text(
            comma(sumPrice ? sumPrice + 3000 : sumPrice)
          );
          $(".main_all-price").text(comma(totalPrice));
          $(".main_all-discount").text("(-) " + comma(discountPrice));
          if (sumPrice === 0) {
            $(".main_all-delivery").text("(+) 0");
          } else {
            $(".main_all-delivery").text(`(+) 3,000`);
          }

          $(".quantity-btn-up").click((e) => {
            let cartid = $(e.target).data("seq");
            let quanti = $(`#cart-quantity-${cartid}`).text();
            $(`#cart-quantity-${cartid}`).text(Number.parseInt(quanti) + 1);
            setQuantity($(`#cart-quantity-${cartid}`).text(), cartid);
            getAllCart(false);
          });

          $(".quantity-btn-down").click((e) => {
            let cartid = $(e.target).data("seq");
            let quanti = $(`#cart-quantity-${cartid}`).text();
            if (quanti !== "1") {
              $(`#cart-quantity-${cartid}`).text(Number.parseInt(quanti) - 1);
              setQuantity($(`#cart-quantity-${cartid}`).text(), cartid);
              getAllCart(false);
            }
          });

          $(".cart-sidebar-btn").click((e) => {
            let allChkCheck = false;
            $(".cart-chk").each((i, item) => {
              if ($(item).is(":checked")) {
                allChkCheck = true;
              }
            });
            if (allChkCheck) {
              location.href = "../user/order.html";
            }
          });

          $(".cart-chk").click((e) => {
            let allChkCheck = true;
            $(".cart-chk").each((i, item) => {
              if (!$(item).is(":checked")) {
                allChkCheck = false;
              }
            });
            if ($(e.target).is(":checked")) {
              $.ajax({
                url: "http://localhost:3000/cart/check",
                type: "post",
                xhrFields: { withCredentials: true },
                crossDomain: true,
                data: { seq: $(e.target).data("seq") },
                success: (msg) => {
                  console.log(msg);
                  getAllCart(false);
                },
                error: () => {
                  alert("error");
                },
              });
            } else {
              $.ajax({
                url: "http://localhost:3000/cart/uncheck",
                type: "post",
                xhrFields: { withCredentials: true },
                crossDomain: true,
                data: { seq: $(e.target).data("seq") },
                success: (msg) => {
                  console.log(msg);
                  getAllCart(false);
                },
                error: () => {
                  alert("error");
                },
              });
            }
            if (!allChkCheck) {
              $(".cart-all-check").attr("checked", false);
            } else {
              $(".cart-all-check").attr("checked", true);
            }
          });

          $(".cart-content-header-right").click((e) => {
            $(".cart-chk").each((i, item) => {
              if ($(item).is(":checked")) {
                deleteChkCart($(item).data("seq"));
                getAllCart(false);
              }
            });
          });

          $(".fa-times").click((e) => {
            if (confirm("상품을 삭제하시겠습니까?")) {
              deleteChkCart($(e.target).data("seq"));
              getAllCart(false);
            }
          });
        }
      },
      error: () => {
        alert("error");
      },
    });
  };

  $(".cart-all-check").click(function () {
    if ($(".cart-all-check").is(":checked")) {
      $.ajax({
        url: "http://localhost:3000/cart/allcheck",
        type: "post",
        xhrFields: { withCredentials: true },
        crossDomain: true,
        data: { userid: loggedInUser.seq },
        success: (msg) => {
          if (msg === "OK") {
            $(".cart-chk").attr("checked", true);
            getAllCart(false);
          }
        },
        error: () => {
          alert("error");
        },
      });
    } else {
      $.ajax({
        url: "http://localhost:3000/cart/alluncheck",
        type: "post",
        xhrFields: { withCredentials: true },
        crossDomain: true,
        data: { userid: loggedInUser.seq },
        success: (msg) => {
          if (msg === "OK") {
            $(".cart-chk").attr("checked", false);
            getAllCart(false);
          }
        },
        error: () => {
          alert("error");
        },
      });
    }
  });

  getAllCart(true);
});
