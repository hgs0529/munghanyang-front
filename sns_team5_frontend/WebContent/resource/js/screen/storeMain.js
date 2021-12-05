$(document).ready(function () {
  $.ajax({
    url: "http://localhost:3000/product/orderproduct",
    type: "get",
    data: { userid: loggedInUser ? loggedInUser.seq : 0, order: 0 }, // date값 변경하기
    success: function (list) {
      console.log(list);
      list.forEach((product) => {
        $(".weekly-best-product-list").append(`
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
                        ((product.price - product.discount) / product.price) *
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
    },
    error: function () {
      alert("error");
    },
  });

  $.ajax({
    url: "http://localhost:3000/product/orderproduct",
    type: "get",
    data: { userid: loggedInUser ? loggedInUser.seq : 0, order: 1 }, // date값 변경하기
    success: function (list) {
      console.log(list);
      $.each(list, (i, product) => {
        $(".best-product-list").append(`
          <div class="product-block-item">
            <div class="image-wrap top-image-wrap" onclick="location.href='../store/product-detail.html?seq=${
              product.seq
            }'">
              <img src="${product.thumbnail}" />
              <div class='bookmark'><span>${i + 1}</span></div>
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
                        ((product.price - product.discount) / product.price) *
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
    },
    error: function () {
      alert("error");
    },
  });

  $.ajax({
    url: "http://localhost:3000/product/orderproduct",
    type: "get",
    data: { userid: loggedInUser ? loggedInUser.seq : 0, order: 2 }, // date값 변경하기
    success: function (list) {
      console.log(list);
      list.forEach((product) => {
        $(".new-product-block-list").append(`
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
                        ((product.price - product.discount) / product.price) *
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
    },
    error: function () {
      alert("error");
    },
  });
});
