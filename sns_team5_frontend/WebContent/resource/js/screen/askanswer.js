$(document).ready(() => {
  const url = new URL(location.href);
  const urlParams = url.searchParams;
  const seq = urlParams.get("seq");
  console.log(seq + "번 문의 답변");

  let productid = 0;
  let answerseq = 0;
  $(document).ready(function () {
    $("#sidebar").load("sidebar.html");

    $.ajax({
      url: "http://localhost:3000/admin/product/ask/detail",
      type: "get",
      data: { seq: seq, ref: 0 },
      xhrFields: { withCredentials: true },
      crossDomain: true,
      success: function (data) {
        $("#askname").val(data.askname);
        $("#pname").val(data.pname);
        $("#wdate").val(data.wdate);
        $("#content").text(data.content);
        productid = data.productid;

        if (data.answered != 0) {
          $.ajax({
            url: "http://localhost:3000/admin/product/answer/detail",
            type: "get",
            data: { ref: seq },
            xhrFields: { withCredentials: true },
            crossDomain: true,
            success: function (data) {
              $("#answer").text(data.content);
              answerseq = data.seq;
              console.log(answerseq);
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
  });

  $("#answerSubmit").click(function () {
    if (answerseq != 0) {
      $.ajax({
        url: "http://localhost:3000/admin/product/answer/update",
        type: "post",
        data: {
          seq: answerseq,
          userid: loggedInUser.seq,
          productid: productid,
          content: $("#answer").val(),
          ref: seq,
        },
        xhrFields: { withCredentials: true },
        crossDomain: true,
        success: function (resp) {
          console.log(resp);
          alert("등록되었습니다.");
          location.href = "../admin/asklist.html";
        },
        error: function () {
          alert("error");
        },
      });
    } else {
      $.ajax({
        url: "http://localhost:3000/admin/product/answer/new",
        type: "post",
        data: {
          userid: loggedInUser.seq,
          productid: productid,
          content: $("#answer").val(),
          ref: seq,
        },
        xhrFields: { withCredentials: true },
        crossDomain: true,
        success: function (resp) {
          console.log(resp);
          alert("등록되었습니다.");
        },
        error: function () {
          alert("error");
        },
      });
    }
  });
});
