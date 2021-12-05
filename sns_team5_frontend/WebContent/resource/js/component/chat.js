$(document).ready(() => {
  console.log("chat.js 시작");
  let element = $(".floating-chat");
  let stomp = null;
  // 웹소켓 연결
  const stompConn = (roomId) => {
    console.log("stomp 시작");
    const sockJs = new SockJS("http://localhost:3000/stomp/chat");
    //SockJS 내부에 들고있는 stomp를 내어줌
    stomp = Stomp.over(sockJs);

    console.log("stompConn", roomId);
    //connection이 맺어지면 실행
    stomp.connect({}, function () {
      console.log("STOMP Connection");
      //subscribe(path, callback)으로 메세지를 받을 수 있음
      stomp.subscribe(
        "http://localhost:3000/sub/chat/room/" + roomId,
        function (chat) {
          let content = JSON.parse(chat.body);
          console.log(content);
          $("#chatbox").append(createMsg(content));
          $("#chatbox")
            .stop()
            .animate({ scrollTop: $("#chatbox")[0].scrollHeight }, 250);
        }
      );
    });
  };

  // 메세지 전송
  const stompSend = (roomId) => {
    stomp.send(
      "http://localhost:3000/pub/chat/message",
      {},
      JSON.stringify({
        chatid: roomId,
        content: $("#msgInput").val().trim(),
        userid: loggedInUser.seq,
      })
    );
    $("#msgInput").val("");
  };

  //웹소켓 연결해제
  const disconnect = () => {
    if (stomp !== null) {
      stomp.disconnect();
      stomp = null;
      console.log(stomp);
    }
  };

  // message 생성 템플릿
  const createMsg = (message) => {
    console.log("create msg");
    let messageDate = "";
    const date = new Date(message.wdate);
    const owner = message.userid === 1 ? "manager" : "user";
    const setDate = () => {
      const weekday = [
        "일요일",
        "월요일",
        "화요일",
        "수요일",
        "목요일",
        "금요일",
        "토요일",
      ];
      messageDate = `${date.getFullYear()}년 ${
        date.getMonth() + 1
      }월 ${date.getDate()}일 ${weekday[date.getDay()]}`;
      if ($(".chat-detail_date").length === 0) {
        return true;
      } else {
        if ($(".chat-detail_date").last().text() === messageDate) {
          return false;
        } else {
          return true;
        }
      }
    };
    const getDate = () => {
      if (setDate()) {
        return `<div class="chat-detail_date">${messageDate}</div>`;
      } else {
        return "";
      }
    };

    const getTime = () => {
      const msgTime = `${
        date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
      }:${
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()
      }`;
      if (setDate()) {
        return `<div class="${owner}-msg_main-content_time">${msgTime}</div>`;
      } else {
        if ($(`.${owner}-msg_main-content_time`).last().val() === msgTime) {
          return "";
        } else {
          return `<div class="${owner}-msg_main-content_time">${msgTime}</div>`;
        }
      }
    };

    const content = () => {
      if (message.content) {
        return message.content;
      } else {
        return `
          <img class="contentImage" src="${message.file}">
        `;
      }
    };

    // 누구글인지 검사해서 작성시간 위치를 결정
    const setContent = () => {
      if (owner === "manager") {
        return `
          <div class="${owner}-msg_main-content_text">${content()}</div>
          ${getTime()}
        `;
      } else {
        return `
          ${getTime()}
          <div class="${owner}-msg_main-content_text">${content()}</div>
        `;
      }
    };

    return `
      ${getDate()}
      <div class="${owner}-msg">
        ${
          owner === "manager"
            ? getTime()
              ? '<div class="manager-profile small"><img src="/upload/logo/logo.png" /></div>'
              : `<div class="manager-profile small invisible"></div>`
            : ""
        }
        <div class="${owner}-msg_main">
          <div class="${owner}-msg_main-name">${
      owner === "manager" ? "Mung ha nynag" : ""
    }</div>
          <div class="${owner}-msg_main-content">
            ${setContent()}
          </div>
        </div>
      </div>
    `;
  };
  let titles = [];
  // 영업시간 표시
  const isClosed = () => {
    const today = new Date();
    if (today.getDay() === 0 || today.getDay() > 5) {
      return false;
    } else {
      if (today.getHours() < 9 || today.getHours() > 17) {
        return false;
      } else {
        return true;
      }
    }
  };

  function btn(clicked_id) {
    $("#chatbox")
      .stop()
      .animate({ scrollTop: $("#chatbox")[0].scrollHeight }, 2000);

    // 글 추가 하는 부분
    $("#chatbox").append(
      "<div class='usermsg'>" + titles[clicked_id] + "</div><br>"
    );

    // naver 전송
    $.ajax({
      url: "http://localhost:3000/chatbot",
      type: "post",
      data: { msg: titles[clicked_id] }, // 유저메시지를 챗봇 주소에 보내기
      success: function (str) {
        console.log(str);
        respProc(str); // 유저메시지에 따라 생긴 반응을 가져오는거
      },
      error: function () {
        alert("error");
      },
    });
    //AJAX 다음에 발동
    $("#chatbox")
      .stop()
      .animate({ scrollTop: $("#chatbox")[0].scrollHeight }, 2000);
  }

  function respProc(str) {
    let json = JSON.parse(str); // object Object 를 볼 수 있게 바꿔줌
    if (json.bubbles[0].type === "text") {
      let textArr = json.bubbles[0].data.description.split("/");
      for (i = 0; i < textArr.length; i++) {
        $("#chatbox").append(
          createMsg({
            content: textArr[i],
            userid: 1,
            wdate: Date.now(),
          })
        );
      }
    } else {
      console.log(json.bubbles[0].data.cover.type); // image, text(link)

      let description = json.bubbles[0].data.cover.data.description;

      for (var i = 0; i < json.bubbles[0].data.contentTable.length; i++) {
        titleleng = json.bubbles[0].data.contentTable.length;

        array = json.bubbles[0].data.contentTable[i][0].data.title;

        let title = json.bubbles[0].data.contentTable[i][0].data.title;

        titles.push(title);
      }

      //메시지는 하나 버튼은 다 가지고 오기
      let textArr = description.split("/");
      for (i = 0; i < textArr.length; i++) {
        $("#chatbox").append(
          createMsg({
            content: textArr[i],
            userid: 1,
            wdate: Date.now(),
          })
        );
      }

      $("#chatbox").append(`
        <div class="bot-btn-wrap"></div>
      `);
      for (var j = 0; j < titleleng; j++) {
        $(".bot-btn-wrap")
          .last()
          .append(`<div data-index=${j} class="bot-btn">${titles[j]}</div>`);
      }

      $(".bot-btn").click((e) => {
        $("#chatbox")
          .stop()
          .animate({ scrollTop: $("#chatbox")[0].scrollHeight }, 2000);

        $("#chatbox").append(
          createMsg({
            content: titles[e.target.dataset.index],
            userid: loggedInUser.seq,
            wdate: Date.now(),
          })
        );
        $.ajax({
          url: "http://localhost:3000/chatbot",
          type: "post",
          data: { msg: titles[e.target.dataset.index] }, // 유저메시지를 챗봇 주소에 보내기
          success: function (str) {
            respProc(str);
          },
          error: function () {
            alert("error");
          },
        });

        $("#chatbox")
          .stop()
          .animate({ scrollTop: $("#chatbox")[0].scrollHeight }, 2000);
      });
      /* let url = json.bubbles[0].data.contentTable[0][0].data.data.action.data.url; */
      //alert(JSON.stringify(url));

      /* let aTag = "<a href='" + url + "' target='_blank'>" + title + "</a>"; */
    }
  }

  // 챗봇
  const addChatbot = () => {
    disconnect();
    console.log("detail 실행");
    $(".chat-container").empty();
    $(".chat-profile").empty();
    backBtn();
    $(".chat-container").append(`<div id="chatDetail"></div>`);

    $("#chatDetail").append(`
      <div id="chatbox"></div>
      <form id="chatform">
        <input type="hidden" name="chatid" >
        <input type="hidden" name="userid" value="${loggedInUser.seq}">
        <i id="msgFileIcon" class="far fa-image"></i>
        <input type="text" id="msgInput">
        <input type="file" id="msgFile" name="uploadFile" accept="image/*">
        <button id="sendMsg"><i class="fas fa-arrow-up"></i></button>
      </form>
    `);
    $("#chatbox")
      .stop()
      .animate({ scrollTop: $("#chatbox")[0].scrollHeight }, 250);
    const firstImg = {
      userid: 1,
      wdate: Date.now(),
      file: "../../image/20211126212553-db453841-c933-4c7d-b0aa-75e7158eb2e9-image.png",
    };
    const firstMsg = {
      userid: 1,
      wdate: Date.now(),
      content: "안녕하세요. (주)멍하냥~사이트의 문의답변 AI 멍냥봇입니다.",
    };
    const secMsg = {
      userid: 1,
      wdate: Date.now(),
      content:
        "시작하시려면 (챗봇, 멍냥봇, 시작, 처음, 초기화, 목록, 버튼) 등을 채팅창에 입력해주세요",
    };
    $("#chatbox").append(createMsg(firstImg));
    $("#chatbox").append(createMsg(firstMsg));
    $("#chatbox").append(createMsg(secMsg));
    $("#sendMsg").click((e) => {
      e.preventDefault();
      if ($("#msgInput").val().trim() !== "") {
        $("#chatbox")
          .stop()
          .animate({ scrollTop: $("#chatbox")[0].scrollHeight }, 2000);
        $("#chatbox").append(
          createMsg({
            userid: loggedInUser.seq,
            wdate: Date.now(),
            content: $("#msgInput").val().trim(),
          })
        );
        $.ajax({
          url: "http://localhost:3000/chatbot",
          type: "post",
          data: { msg: $("#msgInput").val() }, // 유저메시지를 챗봇 주소에 보내기
          success: function (str) {
            respProc(str);
          },
          error: function () {
            alert("error");
          },
        });
        $("#msgInput").val("");
      }
    });
    $("#msgInput").keyup((e) => {
      e.preventDefault();
      if (e.keyCode === 13) {
        if ($("#msgInput").val().trim() !== "") {
          $("#chatbox")
            .stop()
            .animate({ scrollTop: $("#chatbox")[0].scrollHeight }, 2000);
          $("#chatbox").append(
            createMsg({
              userid: loggedInUser.seq,
              wdate: Date.now(),
              content: $("#msgInput").val().trim(),
            })
          );
          $.ajax({
            url: "http://localhost:3000/chatbot",
            type: "post",
            data: { msg: $("#msgInput").val() }, // 유저메시지를 챗봇 주소에 보내기
            success: function (str) {
              respProc(str);
            },
            error: function () {
              alert("error");
            },
          });
          $("#msgInput").val("");
        }
      }
    });
  };

  // 챗팅 추가
  const addChat = () => {
    $.ajax({
      url: "http://localhost:3000/chat/add",
      xhrFields: { withCredentials: true },
      crossDomain: true,
      data: { userid: loggedInUser.seq },
      success: (seq) => {
        disconnect();
        chatDetail(seq);
      },
    });
  };

  // 이미지 업로드
  const imageUpload = (seq) => {
    $.ajax({
      url: "http://localhost:3000/chat/upload",
      type: "post",
      data: new FormData($("#chatform")[0]),
      enctype: "multipart/form-data",
      xhrFields: { withCredentials: true },
      crossDomain: true,
      processData: false,
      contentType: false,
      cash: false,
      success: function (msg) {
        console.log(msg);
      },
      error: function () {
        console.log("error");
      },
    });
  };

  // 챗팅 디테일
  const chatDetail = (seq) => {
    console.log("detail 실행");
    stompConn(seq);
    $(".chat-container").empty();
    $(".chat-profile").empty();
    backBtn();
    $(".chat-container").append(`<div id="chatDetail"></div>`);

    $("#chatDetail").append(`
      <div id="chatbox"></div>
      <form id="chatform">
        <input type="hidden" name="chatid" value="${seq}">
        <input type="hidden" name="userid" value="${loggedInUser.seq}">
        <i id="msgFileIcon" class="far fa-image"></i>
        <input type="text" id="msgInput">
        <input type="file" id="msgFile" name="uploadFile" accept="image/*">
        <button id="sendMsg"><i class="fas fa-arrow-up"></i></button>
      </form>
    `);
    $("#chatbox")
      .stop()
      .animate({ scrollTop: $("#chatbox")[0].scrollHeight }, 250);

    $.ajax({
      url: "http://localhost:3000/chat/messages",
      xhrFields: { withCredentials: true },
      crossDomain: true,
      data: { chatid: seq, userid: loggedInUser.seq },
      success: (resp) => {
        console.log(resp);

        resp.forEach((message) => {
          $("#chatbox").append(createMsg(message));
        });
        //채팅이 입력하고 입력 버튼을 누르거나 엔터치면 발생하는 이벤트 리스너 생성
        $("#sendMsg").click((e) => {
          e.preventDefault();
          if ($("#msgInput").val().trim() !== "") {
            stompSend(Number.parseInt(seq));
          }
        });
        $("#msgInput").keyup((e) => {
          e.preventDefault();
          if (e.keyCode === 13) {
            if ($("#msgInput").val().trim() !== "") {
              stompSend(seq);
            }
          }
        });
        // 파일 업로드아이콘을 누르면 실행되는 이벤트 리스너 생성
        $("#msgFileIcon").click(() => {
          $("#msgFile").click();
        });
        $("#msgFile").on("change", imageUpload);
      },
      error: () => {
        alert("error");
      },
    });
  };

  //시간계산

  // 뒤로가기버튼
  const backBtn = () => {
    element
      .find(".chat-header .chat-profile")
      .append(`<i class="fas fa-chevron-left"></i>`);
    element.find(".chat-header .chat-profile").addClass("backbtn");
    element.find(".chat-header .chat-profile i").click(() => {
      disconnect();
      loadPage("main");
    });
    element
      .find(".chat-header .chat-profile")
      .css("background-color", "#f7f7f7");
  };

  //상담목록들어가는 버튼생성
  const createHeader = (length) => {
    if (loggedInUser.auth !== 3) {
      let icon = "";
      if (length > 3) {
        icon = `<i class="fas fa-chevron-right"></i>`;
      }
      return `
        <div class="chatList-header">
          <div class="chatList-header_list">
            <div>상담목록</div>
            ${icon}
          </div>
        </div>
      `;
    }
  };

  // 채팅목록 생성
  const createListItem = (chat) => {
    if (loggedInUser.auth === 3) {
      if (chat) {
        let content = "";
        let count = "";

        return `
            <div class="chatList-item" data-seq="${chat.seq}">
              <div class="chatList-item_header">
                <div class="chat-profile">
                  <img class="manager-profile" src="${chat.avatar}" />
                </div>
              </div>
              <div class="chatList-item_main">
                <div class="chatList-item_main-title">
                  <div class="main-title_name">${chat.nickname}</div>
                  <div class="main-title_date">${displayedAt(chat.cdate)}</div>
                </div>
                <div class="chatList-item_main-content">
                  <div class="main-content_text">${content}</div>
                </div>
              </div>
              <div class="chatList-item_enter">
                ${count}
                <i class="fas fa-chevron-right"></i>
              </div>
            </div>
          `;
      } else {
        return `
            <div class="nochatlist">
              진행중인 문의가 없습니다.
            </div>
          `;
      }
    } else {
      if (chat) {
        let content = "";
        let count = "";
        if (chat.recentmessage) {
          if (chat.recentmessage.split("/")[1] === "upload") {
            content = `이미지가 업로드 되었습니다.`;
          } else {
            content =
              chat.recentmessage.length > 30
                ? chat.recentmessage.substring(0, 30) + "..."
                : chat.recentmessage;
          }
        }

        if (parseInt(chat.newmessagecount) !== 0) {
          count = `<div class="reddot">${chat.newmessagecount}</div>`;
        }
        return `
            <div class="chatList-item" data-seq="${chat.seq}">
              <div class="chatList-item_header">
                <div class="chat-profile">
                  <img class="manager-profile" src="/upload/logo/logo.png" />
                </div>
              </div>
              <div class="chatList-item_main">
                <div class="chatList-item_main-title">
                  <div class="main-title_name">Mung ha nyang</div>
                  <div class="main-title_date">${displayedAt(chat.cdate)}</div>
                </div>
                <div class="chatList-item_main-content">
                  <div class="main-content_text">${content}</div>
                </div>
              </div>
              <div class="chatList-item_enter">
                ${count}
                <i class="fas fa-chevron-right"></i>
              </div>
            </div>
          `;
      } else {
        return `
            <div class="nochatlist">
              진행중인 문의가 없습니다.
            </div>
          `;
      }
    }
  };

  // 채팅 추가버튼 생성
  const createChatBtn = (chatlength) => {
    let openClosed = "";
    if (isClosed()) {
      openClosed = "보통 수십분 내 답변";
    } else {
      openClosed = "운영시간이 아닙니다. 운영시간 평일 9:00 ~ 18:00";
    }
    let str = "";
    if (loggedInUser.auth === 3) {
    } else {
      if (chatlength === 0) {
        str = `
            <div>상품관련 문의는 상세페이지의 <a href="#">상품문의</a>를 활용해 주세요.</div>
            <div>챗봇을 활용하시면 좀더 빠르게 답변을 받아보실수 있어요.</div>
          `;
      }
      return `
            <div class="chat-start">
              <div class="chat-start_title">
                <div class="chat-profile">
                  <img class="manager-profile" src="/upload/logo/logo.png" />
                </div>
                <div class="chat-start_title-main">
                  <div class="chat-start_title-main_name">Mung ha nynag</div>
                  <div class="chat-start_title-main_content">
                    <div><b><a href="#">FAQ</a> 는 확인해 보셨나요?</b><br>답변이 이미 적혀있을수도 있어요.</div>
                    ${str}
                  </div>
                </div>
              </div>
              <div class="chat-start_qna">
                <i class="fas fa-paper-plane"></i>
                <div>상담원과 1:1 문의하기</div>
              </div>
              <div class="chat-start_bot">
                <i class="fas fa-robot"></i>
                <div>챗봇으로 문의하기</div>
              </div>
              <div class="businessHour">
                <div class="${isClosed() ? "greendot" : "yellowdot"}"></div>
                <div class="businessHour_time">${openClosed}</div>
              </div>
            </div>
          `;
    }
  };

  // allchatlist화면단 셋팅
  const setAllChatList = (chatList) => {
    $("#chatListAll").append(createHeader(chatList.length));
    for (i = 0; i < chatList.length; i++) {
      $("#chatListAll").append(createListItem(chatList[i]));
    }
    $(".chatList-header_list").off("click", () => {
      loadPage("all");
    });
    $(".chatList-header_list").css("cursor", "");
    $(".chatList-header_list").off("click", () => {
      loadPage("all");
    });
    backBtn();
  };

  // chatlist 메인화면단 셋팅
  const setChatListMain = (chatList) => {
    element
      .find(".chat-header .chat-profile")
      .append(`<img class="manager-profile" src="/upload/logo/logo.png" />`);
    element
      .find(".chat-header .chat-profile")
      .css("background-color", "rgba(0, 0, 0, 0.05)");
    $(".chat-profile").removeClass("allList");
    if (loggedInUser.auth === 1) {
      if (chatList.length === 0) {
        $("#chatList").append(
          `<div class="noChatList">아직 추가된 상담목록이 없습니다.</div>`
        );
        $("#chatList").append(
          `<div class="noChatList">아래 버튼을 클릭하시면 상담원과 연결됩니다.</div>`
        );
      } else if (chatList.length <= 3) {
        $("#chatList").append(createHeader(chatList.length));
        for (i = 0; i < chatList.length; i++) {
          $("#chatList").append(createListItem(chatList[i]));
        }
      } else {
        $("#chatList").append(createHeader(chatList.length));
        for (i = 0; i < 3; i++) {
          $("#chatList").append(createListItem(chatList[i]));
        }
      }
    } else {
      $("#chatList").append(createHeader(chatList.length));
      for (i = 0; i < chatList.length; i++) {
        $("#chatList").append(createListItem(chatList[i]));
      }
    }
    $("#addChatBtn").append(createChatBtn(chatList.length));
    $(".chatList-header_list").on("click", () => {
      loadPage("all");
    });
    $(".chat-start_qna").on("click", addChat);
    $(".chat-start_bot").on("click", addChatbot);
    $(".chatList-header_list").css("cursor", "pointer");
    $(".chat-profile")
      .find("i")
      .off("click", () => {
        loadPage("main");
      });
  };
  const loadPage = (page) => {
    if (loggedInUser.auth === 3) {
      $(".chat-container").empty();
      $(".chat-profile").empty();
      $.ajax({
        url: "http://localhost:3000/chat/manager",
        xhrFields: { withCredentials: true },
        crossDomain: true,
        data: { auth: loggedInUser.auth },
        success: (resp) => {
          console.log(resp);
          // allchatlist화면
          if (page === "all") {
            $(".chat-container").append(`<div id="chatListAll"></div>`);
            setAllChatList(resp);
            // chat main 화면
          } else {
            console.log("chat main load");
            $(".chat-container").append(`
              <div id="chatList"></div>
              <div id="addChatBtn"></div>
          `);
            setChatListMain(resp);
          }

          stompConn(loggedInUser.nickname);
          // 챗팅 리스트를 로딩하고 바로 이벤트리스너를 달아줌
          $(".chatList-item").on("click", (e) => {
            disconnect();
            let target = e.target;
            let targetSeq;
            while (true) {
              if (target.className === "chatList-item") {
                targetSeq = target.dataset.seq;
                break;
              }
              target = target.parentNode;
            }
            chatDetail(targetSeq);
          });
        },
        error: () => {
          alert("error");
        },
      });
    } else {
      $(".chat-container").empty();
      $(".chat-profile").empty();
      $.ajax({
        url: "http://localhost:3000/chat/all",
        xhrFields: { withCredentials: true },
        crossDomain: true,
        data: { userid: loggedInUser.seq },
        success: (resp) => {
          console.log(resp);
          // allchatlist화면
          if (page === "all") {
            $(".chat-container").append(`<div id="chatListAll"></div>`);
            setAllChatList(resp);
            // chat main 화면
          } else {
            console.log("chat main load");
            $(".chat-container").append(`
              <div id="chatList"></div>
              <div id="addChatBtn"></div>
          `);
            setChatListMain(resp);
          }

          stompConn(loggedInUser.nickname);
          // 챗팅 리스트를 로딩하고 바로 이벤트리스너를 달아줌
          $(".chatList-item").on("click", (e) => {
            disconnect();
            let target = e.target;
            let targetSeq;
            while (true) {
              if (target.className === "chatList-item") {
                targetSeq = target.dataset.seq;
                break;
              }
              target = target.parentNode;
            }
            chatDetail(targetSeq);
          });
        },
        error: () => {
          alert("error");
        },
      });
    }
  };

  console.log("chatlist 끝");

  // 상담 열기
  const openElement = () => {
    element.find(">i").hide();
    element.addClass("expand");
    element.find(".chat").addClass("enter");
    element.off("click", openElement);
    element.find(".chat-header .chat-btn").click(closeElement);
    loadPage("main");
    element
      .find(".chat-start_title .chat-profile")
      .append(`<img class="manager-profile" src="/upload/logo/logo.png" />`);
  };

  //상담 닫기
  function closeElement() {
    element.find(".chat").removeClass("enter").hide();
    element.find(">i").show();
    element.removeClass("expand");
    element.find(".chat-header .chat-btn").off("click", closeElement);
    element.find(".chat-profile").html("");
    disconnect();
    setTimeout(function () {
      element.find(".chat").removeClass("enter").show();
      element.click(openElement);
    }, 500);
  }

  // 화면이 바뀌면 웹소켓 연결해제
  window.onbeforeunload = () => {
    disconnect();
  };

  setTimeout(function () {
    element.addClass("enter");
  }, 1000);

  element.click(openElement);

  $("#button-send").click(stompSend);
  console.log("chat.js 끝");
});
