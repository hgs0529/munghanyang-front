$(document).ready(() => {
  function comma(str) {
    str = String(str);
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,");
  }

  //콤마풀기
  function uncomma(str) {
    str = String(str);
    return str.replace(/[^\d]+/g, "");
  }

  if (!loggedInUser) {
    location.href = "../sns/main.html";
  }

  let newAddress = false;
  let firstAddress = false;
  let items = null;

  $.ajax({
    url: "http://localhost:3000/cart/getcheck",
    xhrFields: { withCredentials: true },
    crossDomain: true,
    data: { userid: loggedInUser.seq },
    success: function (list) {
      console.log(list);
      if (list.length === 0) {
        alert("주문목록이 없습니다");
        location.href = "../store/main.html";
      } else {
        let sumPrice = 0;
        items = list;
        list.forEach((item) => {
          if (item.status === 0) {
            sumPrice += item.discount
              ? item.discount * item.quantity
              : item.price * item.quantity;
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

          $(".order-left-product_list").append(`
              <div class="cart-content-list_item">
                <div class="cart-content-list_main order">
                  <div class="cart-image-wrap">
                    <img src="${item.file}">
                  </div>
                  <div class="cart-item-title">
                    <div>${item.name}</div>
                    <div>${option}</div>
                  </div>
                  <div class="cart-item-pricewrap">
                  <div>${item.quantity} 개</div>
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
                </div>
              </div>
            `);
        });

        $.ajax({
          url: "http://localhost:3000/address/all",
          xhrFields: { withCredentials: true },
          crossDomain: true,
          data: { userid: loggedInUser.seq },
          success: function (list) {
            console.log(list);

            let addressList = [];
            let addressNameList = "";
            for (i = 0; i < list.length; i++) {
              if (list[i].def === true) {
                // addressNameList += `<option value="${i}">${list[i].addressname}</option>`;
                addressList.push(list[i]);
              }
            }
            for (i = 0; i < list.length; i++) {
              if (list[i].def === false) {
                addressList.push(list[i]);
              }
            }
            for (i = 0; i < addressList.length; i++) {
              addressNameList += `<option data-seq=${addressList[i].seq} value="${i}">${addressList[i].addressname}</option>`;
            }
            if (list.length === 0) {
              firstAddress = true;
              newAddress = true;
              $(".order-left-address_btns").append(`
                <div class="add-new-address-btn active">신규배송지</div>
              `);
              $(".order-left-address_form").css("display", "block");
              $(".order-left-address_form1").css("display", "none");
            } else {
              newAddress = false;
              $(".order-left-address_btns").append(`
                <div class="add-select-address-btn active">배송지선택</div>
                <div class="add-new-address-btn">신규배송지</div>
              `);
              $(".order-left-address_form").css("display", "none");
              $(".order-left-address_form1").css("display", "block");
              $("#address-form-address-list").append(addressNameList);
              $("#receiver-name-select").val(addressList[0].receiveuser);
              $("#receiver-phone-select").val(addressList[0].receivephone);
              $("#adress-adress1-select").val(
                addressList[0].address.split("-")[0]
              );
              $("#adress-adress2-select").val(
                addressList[0].address.split("-")[1]
              );

              $("#address-form-address-list").change((e) => {
                $("#receiver-name-select").val(
                  addressList[$(e.target).val()].receiveuser
                );
                $("#receiver-phone-select").val(
                  addressList[$(e.target).val()].receivephone
                );
                $("#adress-adress1-select").val(
                  addressList[$(e.target).val()].address.split("-")[0]
                );
                $("#adress-adress2-select").val(
                  addressList[$(e.target).val()].address.split("-")[1]
                );
              });
            }

            $("#receiver-phone").on(
              "propertychange change keyup paste input",
              () => {
                if ($("#receiver-phone").val().length > 4) {
                  if ($("#receiver-phone").val()[4] !== "-") {
                    $("#receiver-phone").val(
                      $("#receiver-phone").val().slice(0, 4) +
                        "-" +
                        $("#receiver-phone")
                          .val()
                          .slice(5, $("#receiver-phone").val().length - 1)
                    );
                  }
                }
              }
            );

            $(".add-new-address-btn").click(() => {
              newAddress = true;
              console.log("click");
              $(".add-select-address-btn").removeClass("active");
              $(".add-new-address-btn").addClass("active");
              $(".order-left-address_form").css("display", "block");
              $(".order-left-address_form1").css("display", "none");
            });

            $(".add-select-address-btn").click(() => {
              newAddress = false;
              $(".add-new-address-btn").removeClass("active");
              $(".add-select-address-btn").addClass("active");
              $(".order-left-address_form").css("display", "none");
              $(".order-left-address_form1").css("display", "block");
              console.log(
                $("#address-form-address-list option:selected").data("seq")
              );
            });
          },
          error: () => {
            alert("error");
          },
        });

        $(".order-right-total-val").text(comma(sumPrice));
        $(".order-right-delivery-val").text(`(+) 3,000`);
        $(".order-right-sum-val").text(comma(sumPrice + 3000));
        $(".order-right-sum-point").text(comma((sumPrice * 1) / 100) + "P");

        $("#use-mungpoint").focus(() => {
          if ($("#use-mungpoint").val() === "0") {
            $("#use-mungpoint").val("");
          }
        });

        $("#orderer-phone").on(
          "propertychange change keyup paste input",
          () => {
            if ($("#orderer-phone").val().length > 4) {
              if ($("#orderer-phone").val()[4] !== "-") {
                $("#orderer-phone").val(
                  $("#orderer-phone").val().slice(0, 4) +
                    "-" +
                    $("#orderer-phone")
                      .val()
                      .slice(5, $("#orderer-phone").val().length - 1)
                );
              }
            }
          }
        );

        $("#use-mungpoint").on(
          "propertychange change keyup paste input",
          () => {
            if ($("#use-mungpoint").val()[0] === "0") {
              console.log($("#use-mungpoint").val()[0]);
              $("#use-mungpoint").val($("#use-mungpoint").val().substr(1));
            }
            let s = $("#use-mungpoint").val();
            let chkStyle = /\d/;
            if (chkStyle.test(s)) {
              $("#use-mungpoint").css("border-color", "rgba(0, 0, 0, 0.1)");
              if (loggedInUser.mungpoint > sumPrice + 3000) {
                if (
                  Number.parseInt($("#use-mungpoint").val()) >
                  sumPrice + 3000
                ) {
                  $("#use-mungpoint").val(sumPrice + 3000);
                }
                $(".order-right-point-val").text(
                  "(-)" + Number.parseInt(s).toLocaleString()
                );
                $(".order-right-sum-val").text(
                  comma(sumPrice + 3000 - Number.parseInt(s))
                );
              } else {
                if (
                  Number.parseInt($("#use-mungpoint").val()) >
                  loggedInUser.mungpoint
                ) {
                  $("#use-mungpoint").val(loggedInUser.mungpoint);
                }
                $(".order-right-point-val").text(
                  "(-)" + Number.parseInt(s).toLocaleString()
                );
                $(".order-right-sum-val").text(
                  comma(sumPrice + 3000 - Number.parseInt(s))
                );
              }
            } else {
              if ($("#use-mungpoint").val() === "") {
                $("#use-mungpoint").val("0");
              }
              $("#use-mungpoint").css("border-color", "red");
            }
          }
        );

        $(".useAllPoint").click(() => {
          if (sumPrice + 3000 > loggedInUser.mungpoint) {
            $("#use-mungpoint").val(loggedInUser.mungpoint);
            $(".order-right-point-val").text(
              "(-)" + loggedInUser.mungpoint.toLocaleString()
            );
            $(".order-right-sum-val").text(
              comma(sumPrice + 3000 - loggedInUser.mungpoint)
            );
          } else {
            $("#use-mungpoint").val(sumPrice + 3000);
            $(".order-right-point-val").text(
              "(-)" + (sumPrice + 3000).toLocaleString()
            );
            $(".order-right-sum-val").text("0");
          }
        });

        const doPay = () => {
          var IMP = window.IMP;
          IMP.init("imp93124800");
          // 'iamport' 대신 부여받은 "가맹점 식별코드"를 사용
          // i'mport 관리자 페이지 -> 내정보 -> 가맹점식별코드
          IMP.request_pay(
            {
              pg: "inicis",
              pay_method: "card",
              merchant_uid: "merchant_" + new Date().getTime(),
              name: $(".cart-item-title").find("div").first().text(),
              amount: uncomma($(".order-right-sum-val").text()),
            },
            function (rsp) {
              if (rsp.success) {
                const userid = loggedInUser.seq;
                const addressname = $("#address-name").val();
                const address = `${$("#adress-adress1").val()}-${$(
                  "#adress-adress2"
                ).val()}`;
                const receiveuser = $("#receiver-name").val().trim();
                const receivephone = `${$(
                  "#address-form-phone_firstNum"
                ).val()}-${$("#receiver-phone").val().trim()}`;
                const productamount = sumPrice;
                let addressid = newAddress
                  ? 0
                  : $("#address-form-address-list option:selected").data("seq");
                let orderid = 0;

                const addOrderDetails = (seq) => {
                  console.log();
                  for (i = 0; i < items.length; i++) {
                    $.ajax({
                      url: "http://localhost:3000/ordersdetail/new",
                      xhrFields: { withCredentials: true },
                      crossDomain: true,
                      type: "post",
                      async: false,
                      data: {
                        userid,
                        productid: items[i].productid,
                        orderid: seq,
                        selection: items[i].options,
                        quantity: items[i].quantity,
                        totalamount: items[i].discount
                          ? items[i].discount
                          : items[i].price,
                      },
                      success: function (resp) {
                        console.log("ordersdetail");
                        if (resp == "OK") {
                          deleteCart();
                          console.log("주문등록이 완료되었습니다.");
                          location.href = `../user/userdetail.html?content=orderlist&user=${loggedInUser.seq}`;
                        } else {
                          console.log("주문등록 실패");
                        }
                      },
                      error: function () {
                        alert("error");
                      },
                    });
                  }
                };

                const addOrder = (seq) => {
                  $.ajax({
                    url: "http://localhost:3000/orders/new",
                    xhrFields: { withCredentials: true },
                    crossDomain: true,
                    type: "post",
                    async: false,
                    data: {
                      orderername: $("#orderer-name").val().trim(),
                      ordereremail: $("#orderer-email").val().trim(),
                      ordererphone: `${$(
                        "#order-left-orderer_firstNum"
                      ).val()}-${$("#orderer-phone").val().trim()}`,
                      userid,
                      addressid: seq,
                      productamount,
                      deliveryamount: 3000,
                      totalamount:
                        sumPrice +
                        3000 -
                        Number.parseInt($("#use-mungpoint").val()),
                      usemungpoint: $("#use-mungpoint").val(),
                      savemungpoint: (sumPrice * 1) / 100,
                      ordermessage: newAddress
                        ? $("#order-left-receiver_msg").val()
                        : $("#order-left-receiver_msg-select").val(),
                    },
                    success: function (seq) {
                      console.log("orders");
                      orderid = seq;
                    },
                    error: function () {
                      alert("error");
                    },
                  });
                };

                const addAddress = (def) => {
                  $.ajax({
                    url: "http://localhost:3000/address/new",
                    xhrFields: { withCredentials: true },
                    crossDomain: true,
                    type: "post",
                    async: false,
                    data: {
                      userid,
                      addressname,
                      address,
                      receiveuser,
                      receivephone,
                      def,
                    },
                    success: function (seq) {
                      addressid = seq;
                    },
                    error: function () {
                      alert("error");
                    },
                  });
                };

                const deleteCart = () => {
                  $.ajax({
                    url: "http://localhost:3000/cart/afterdel",
                    xhrFields: { withCredentials: true },
                    crossDomain: true,
                    type: "post",
                    async: false,
                    data: {
                      userid,
                    },
                    success: function (msg) {
                      if (msg === "OK") {
                        console.log("카트삭제성공");
                      }
                    },
                    error: function () {
                      alert("error");
                    },
                  });
                };

                if (newAddress) {
                  if (firstAddress) {
                    addAddress(true);
                  } else {
                    addAddress(false);
                  }
                }
                addOrder(addressid);
                addOrderDetails(orderid);
              } else {
                alert("결제 에러");
              }
            }
          );
        };

        $(".order-right-btn").click(() => {
          console.log($("#order-left-receiver_msg").val());
          if (
            !$("#orderer-name").val().trim() ||
            !$("#orderer-email").val().trim() ||
            !$("#orderer-phone").val().trim()
          ) {
            alert("주문자 정보를 확인해주세요");
          } else {
            if (newAddress) {
              if (
                !$("#receiver-name").val().trim() ||
                !$("#address-form-phone_firstNum").val() ||
                !$("#receiver-phone").val().trim() ||
                !$("#address-name").val() ||
                !$("#adress-adress1").val() ||
                !$("#adress-adress2").val()
              ) {
                alert("배송지 정보를 확인해주세요");
              } else {
                doPay();
              }
            } else {
              doPay();
            }
          }
        });
      }
    },
    error: function () {
      alert("error");
    },
  });

  $(".order-left-porint_mypoint-my").text(
    loggedInUser.mungpoint.toLocaleString() + "P"
  );
});
