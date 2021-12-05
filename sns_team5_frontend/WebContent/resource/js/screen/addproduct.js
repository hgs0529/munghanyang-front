$(document).ready(() => {
  $(function () {
    $("#summernote").summernote({
      height: 500,
      width: 800,
      toolbar: [
        ["style", ["style"]],
        ["font", ["bold", "italic", "underline", "clear"]],
        ["fontname", ["fontname"]],
        ["color", ["color"]],
        ["insert", ["picture"]],
        ["view", ["codeview"]],
      ],
      callbacks: {
        onImageUpload: function (files, editor, welEditable) {
          for (var i = files.length - 1; i >= 0; i--) {
            sendFile(files[i], this);
          }
        },
      },
    });
  });

  function sendFile(file, el) {
    var form_data = new FormData();
    form_data.append("file", file);
    $.ajax({
      data: form_data,
      type: "POST",
      xhrFields: { withCredentials: true },
      crossDomain: true,
      url: "http://localhost:3000/product/uploadSummernoteImage",
      cache: false,
      contentType: false,
      enctype: "multipart/form-data",
      processData: false,
      success: function (img_name) {
        alert("success");
        alert(img_name);
        $(el).summernote("editor.insertImage", img_name);
      },
      error: function () {
        alert("error");
      },
    });
  }

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

  function choiceChangeone() {
    let target = $("#selectone").val();
    console.log(target);

    $.ajax({
      url: "http://localhost:3000/product/dogorcatcategory",
      type: "get",
      xhrFields: { withCredentials: true },
      crossDomain: true,
      data: { dogorcat: target }, // 맞게 수정해야함
      success: function (list) {
        $("#selecttwo").html("");
        for (i = 0; i < list.length; i++) {
          let opt =
            "<option value=" +
            list[i].catecode +
            ">" +
            list[i].catename +
            "</option>";
          $("#selecttwo").append(opt);
        }
      },
      error: function () {
        alert("error");
      },
    });
  }

  $("#selectone").change(choiceChangeone);

  function choiceChangetwo() {
    let target = $("#selecttwo").val();

    $.ajax({
      url: "http://localhost:3000/product/detailcategory",
      type: "get",
      xhrFields: { withCredentials: true },
      crossDomain: true,
      data: { catecode: target }, // 맞게 수정해야함
      success: function (list) {
        $("#selectthree").html("");
        for (i = 0; i < list.length; i++) {
          let opt =
            "<option value=" +
            list[i].catecode +
            ">" +
            list[i].catename +
            "</option>";
          $("#selectthree").append(opt);
        }
      },
      error: function () {
        alert("error");
      },
    });
  }

  $("#selecttwo").change(choiceChangetwo);

  function delForm(e) {
    let parent;
    if ($(e.target).hasClass("fas")) {
      parent = $(e.target).parent().parent();
    } else {
      parent = $(e.target).parent();
    }
    const optionName = parent.find("div").first().text();
    $(".product-cate-select_item").each((i, item) => {
      console.log($(item).find("div").text().trim());
      //console.log(optionName);
      if ($(item).find("div").text().trim() === optionName) {
        $(item).remove();
      }
    });
  }

  const delForm1 = (e) => {
    let parent;
    if ($(e.target).hasClass("fas")) {
      parent = $(e.target).parent().parent();
    } else {
      parent = $(e.target).parent();
    }
    parent.remove();
  };

  const addOption = (e) => {
    if ($(e.target).hasClass("fas")) {
      parent = $(e.target).parent().parent();
    } else {
      parent = $(e.target).parent();
    }
    let optionName = parent.children().first().text();
    console.log(optionName);
    parent.after(`
    <div class="product-cate-select_item">
      <div style="display:none;">${optionName}</div>
        <input
          style="margin-left:100px;"
          type="text"
          placeholder="옵션명"
        />
        <input
          type="text"
          placeholder="옵션가격"
        />
        <div class="option-btn deleteOptions1">
          <i class="fas fa-minus"></i>
        </div>
    </div>
    `);
    $(".deleteOptions1").off("click", delForm1);
    $(".deleteOptions1").on("click", delForm1);
  };

  function addOptiontitle(e) {
    if (e.keyCode === 13) {
      let isSame = false;
      $(".product-cate-select_item").each((i, item) => {
        if ($(item).children().first().text() === $("#optionname").val()) {
          isSame = true;
          return;
        }
      });
      if (!isSame) {
        if ($("#optionname").val().trim()) {
          $(e.target).parent().parent().append(`
            <div class="product-cate-select_item">
              <div>${$("#optionname").val()}</div>
                <input
                  type="text"
                  placeholder="옵션명"
                />
                <input
                  type="text"
                  placeholder="옵션가격"
                />
                <div class="option-btn addOptions">
                  <i class="fas fa-plus"></i>
                </div>
                <div class="option-btn deleteOptions">
                  <i class="fas fa-minus"></i>
                </div>
            </div>
          `);
        }
        $("#optionname").val("");
        $(".deleteOptions").off("click", delForm);
        $(".deleteOptions").on("click", delForm);
        $(".addOptions").off("click", addOption);
        $(".addOptions").on("click", addOption);
      } else {
        $("#optionname").val("");
      }
    }
  }

  $("#optionname").keyup(addOptiontitle);

  $(".add-product-btn").click(() => {
    let optionstring = "";
    $(".product-cate-select_item").each((i, item) => {
      const name = $(item).children().first().text();
      const subname = $(item).find("input").first().val();
      const price = $(item).find("input").last().val();
      optionstring += `${i === 0 ? "" : "?"}${name}-${subname}-${price}`;
    });
    const formData = new FormData($("#productFrm")[0]);
    formData.append("optionstring", optionstring);
    formData.append(
      "discount",
      $("#discount-input").val() ? $("#discount-input").val() : 0
    );
    console.log("name", formData.get("name"));
    console.log("optionstring", formData.get("optionstring"));
    console.log("price", formData.get("price"));
    console.log("discount", formData.get("discount"));
    console.log("categorycode", formData.get("categorycode"));
    console.log("content", formData.get("content"));
    $.ajax({
      url: "http://localhost:3000/product/add",
      type: "post",
      xhrFields: { withCredentials: true },
      crossDomain: true,
      data: formData,
      enctype: "multipart/form-data",
      processData: false,
      contentType: false,
      cash: false,
      success: function (str) {
        alert("success");
      },
      error: function () {
        alert("error");
      },
    });
  });
});
