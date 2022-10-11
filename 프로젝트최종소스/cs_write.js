const firebaseConfig = {
  apiKey: "AIzaSyDtVA_IYoYtVpeDuUF_UmKLFwOlg44CAic",
  authDomain: "terrgym-demo-bac70.firebaseapp.com",
  databaseURL:
    "https://terrgym-demo-bac70-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "terrgym-demo-bac70",
  storageBucket: "terrgym-demo-bac70.appspot.com",
  messagingSenderId: "679211028162",
  appId: "1:679211028162:web:d6839267c5c25146ccb55b",
};

// Initialize Firebase

firebase.initializeApp(firebaseConfig);

var firebaseEmailAuth; //파이어베이스 email 인증 모듈 전역변수
var firebaseDatabase; //파이어베이스 db 모듈 전역변수
var Name; //유저 이름
var loginUserKey; //로그인한 유저의 부모 key
var userInfo; //로그인한 유저의 정보 object type

//인증모듈 객체 가져오기
firebaseEmailAuth = firebase.auth();
//데이터베이스 모듈객체 가져오기
firebaseDatabase = firebase.database();

//세션 체크 함수
userSessionCheck();

function userSessionCheck() {
  //로그인이 되어있으면 - 유저가 있으면, user를 인자값으로 넘겨준다.
  firebaseEmailAuth.onAuthStateChanged(function (user) {
    if (user) {
      
      //조회 - 데이터 베이스에 저장된 닉네임을 현재 접속되어 있는 user의 pk key 값을 이용해서 가져오기
      firebaseDatabase
        .ref("users/" + user.uid)
        .once("value")
        .then(function (snapshot) {
          const date = new Date();
          //자바스크립트 dom 선택자를 통해서 네비게이션 메뉴의 엘리먼트 변경해주기
          document.getElementById("loginmenu").textContent = "로그아웃";
          document.getElementById("loginmenu").addEventListener("click", () => {
            // 로그아웃 기능구현하기
            firebase
              .auth()
              .signOut()
              .then(() => {
                alert("로그아웃 되었습니다.");
                window.location = "main.html";
              })
              .catch((error) => {
                console.log(error);
              });
          });
          document.getElementById("joinmenu").textContent =
            user.displayName + " 님";
          document.getElementById("writer").textContent = user.displayName;
          document.getElementById("write_date").textContent =
            date.toLocaleString("ko-kr");
          document.getElementById("joinmenu").addEventListener("click", () => {
            // 마이페이지로 이동하기
            alert("마이페이지로 이동합니다.");
            window.location.href = "./mypage.html";
          });
          document.querySelector("#loginmenu").addEventListener("click", () => {
            window.location = "login.html";
          });
          loginUserKey = snapshot.key; //로그인한 유저의 key도 계속 쓸 것이기 때문에 전역변수로 할당
          userInfo = snapshot.val(); //snapshot.val()에 user 테이블에 있는 해당 개체 정보가 넘어온다. userInfo에 대입!
          return true;
        });
    } else {
      alert("로그인이 필요한 서비스입니다.");
      return false;
    }
    console.log(user.uid);
    const db = firebase.firestore();
    const storage = firebase.storage();
    $("#register").click(function () {
      let cate = $(".form-select").val();
      const subject = $("#subject").val();
      const date = new Date();
      const write_date = date.toLocaleString("ko-kr");
      // const writer = user.displayName;
      const content = $("#content").val();

      if ("1:1문의" == cate) {
        db.collection("QNA")
          .add({
            uid: user.uid,
            cate: cate,
            subject: subject,
            write_date: write_date,
            writer: user.displayName,
            content: content,
          })
          .catch((error) => {
            console.log(error);
          });
        alert("등록되었습니다");
        setTimeout(function () {
          window.location = "cs_personal.html";
        }, 1000);
      } else {
        db.collection("ntc")
          .add({
            uid: user.uid,
            cate: cate,
            subject: subject,
            write_date: write_date,
            writer: user.displayName,
            content: content,
          })
          .catch((error) => {
            console.log(error);
          });
        alert("등록되었습니다");
        setTimeout(function () {
          window.location = "cs_qna.html";
        }, 1500);
      }
    });
  });
}
