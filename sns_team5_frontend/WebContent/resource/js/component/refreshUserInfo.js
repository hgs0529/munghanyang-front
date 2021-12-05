let loggedInUser = null;
const urlArr = location.href.split("/");
const loadedPage = urlArr[urlArr.length - 1].split(".")[0];
const loadedDir = urlArr[urlArr.length - 2];

const url = new URL(location.href);
const urlParams = url.searchParams;
const userSeq = urlParams.get("user");
let selectedUser = null;

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

const getLoggedInUser = () => {
  $.ajax({
    url: "http://localhost:3000/user/refresh",
    async: false,
    xhrFields: { withCredentials: true },
    crossDomain: true,
    success: (resp) => {
      console.log("로그인유저", resp);
      if (resp) {
        loggedInUser = resp;
        console.log("refresh 끝");
      }
    },
    error: () => {
      alert("에러");
    },
  });
};

const getUser = () => {
  $.ajax({
    url: "http://localhost:3000/user/",
    data: { userid: userSeq, login: loggedInUser ? loggedInUser.seq : 0 },
    xhrFields: { withCredentials: true },
    async: false,
    crossDomain: true,
    success: (resp) => {
      console.log("유저", resp);
      if (resp) {
        selectedUser = resp;
      }
    },
    error: () => {
      alert("에러");
    },
  });
};
getLoggedInUser();
if (userSeq) {
  getUser();
}
