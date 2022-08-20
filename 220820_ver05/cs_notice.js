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
dbtable();

function userSessionCheck() {
  //로그인이 되어있으면 - 유저가 있으면, user를 인자값으로 넘겨준다.
  firebaseEmailAuth.onAuthStateChanged(function (user) {
    if (user) {
      //조회 - 데이터 베이스에 저장된 닉네임을 현재 접속되어 있는 user의 pk key 값을 이용해서 가져오기
      firebaseDatabase
        .ref("users/" + user.uid)
        .once("value")
        .then(function (snapshot) {
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
          document.getElementById("joinmenu").addEventListener("click", () => {
            // 마이페이지로 이동하기
            alert("마이페이지로 이동합니다.");
            window.location.href = "./mypage.html";
          });
          document.querySelector("#loginmenu").addEventListener("click", () => {
            window.location = "login.html";
          });

          ///////// 로그인한 아이디 레벨 확인, 권한 부여 /////////////
          const db = firebase.firestore();
          const docRef = db.collection("user").doc(user.uid);
          docRef
            .get()
            .then((doc) => {
              if (doc.exists) {
                // 로그인 계정의 정보 콘솔에 출력하는 코드
                // console.log("Document data:", doc.data());
                // 관리자는 레벨 5를 부여하여 회원과 구분함
                if (doc.data().level > 1) {
                  const test = document.querySelector("#write_register");
                  test.style.cssText = "";
                  console.log("관리자 계정 확인, 숨겨진 버튼 보여줄게");
                } else if (doc.data().level == 1) {
                  console.log("회원 계정 확인");
                } else console.log("비회원 확인");
              } else {
              }
            })
            .catch((error) => {
              console.log("에러 발생: ", error);
            });

          loginUserKey = snapshot.key; //로그인한 유저의 key도 계속 쓸 것이기 때문에 전역변수로 할당
          userInfo = snapshot.val(); //snapshot.val()에 user 테이블에 있는 해당 개체 정보가 넘어온다. userInfo에 대입!
          return true;
        });
    } else {
      return false;
    }
  });
}

//전체레코드 갯수
class PageBar {
  totalRecord;
  //페이지당 레코드 수
  numPerPage; // 10개씩이다
  //블럭당 디폴트 페이지 수
  pagePerBlock = 5;
  //총페이지 수
  totalPage;
  //총블럭 수
  totalBlock;
  //현재 내가 바라보는 페이지 수
  nowPage;
  //현재 내가 바라보는 블럭 수
  nowBlock;
  //적용할 페이지 이름
  pagePath;
  pagination;
  // 자바와는 다르게 오버로딩을 지원하지 않ㅇ아..컨벤션
  constructor(numPerPage, totalRecord, nowPage, pagePath) {
    this.numPerPage = numPerPage;
    this.totalRecord = totalRecord;
    //alert(totalRecord);
    this.nowPage = nowPage;
    this.pagePath = pagePath;
    this.totalPage = Math.ceil(this.totalRecord / this.numPerPage); // 47.0/10=> 4.7 4.1->5page 4.2->5page
    this.totalBlock = Math.ceil(this.totalPage / this.pagePerBlock); //5.0/2=> 2.5-> 3장
    //현재 내가바라보는 페이지 : (int)((double)4-1/2)
    this.nowBlock = Math.floor(this.nowPage / this.pagePerBlock);
  }
  //setter메소드 선언
  setPageBar() {
    // console.log("nowBlock:" + this.nowBlock);
    let pageLink = "";
    //전체 레코드 수가 0보다 클때 처리하기
    if (this.totalRecord > 0) {
      //nowBlock이 0보다 클때 처리
      //이전 페이지로 이동 해야 하므로 페이지 번호에 a태그를 붙여야 하고
      //pagePath뒤에 이동할 페이지 번호를 붙여서 호출 해야함.
      if (this.nowBlock > 0) {
        //(1-1)*2+(2-1)=1
        pageLink +=
          "<a style='color: black;' href='" +
          this.pagePath +
          "?nowPage=" +
          ((this.nowBlock - 1) * this.pagePerBlock + (this.pagePerBlock - 1)) +
          "'>";
        pageLink += "<img border=0 src='./images/bu_a.gif'>";
        pageLink += "</a>&nbsp;&nbsp;";
      }
      for (let i = 0; i < this.pagePerBlock; i++) {
        //현재 내가 보고 있는 페이지 블록 일때와
        if (this.nowBlock * this.pagePerBlock + i == this.nowPage) {
          pageLink +=
            "<b>" + (this.nowBlock * this.pagePerBlock + i + 1) + "</b>&nbsp;";
        }
        //그렇지 않을 때를 나누어 처리해야 함.
        else {
          pageLink +=
            "<a style='color: black;' href='" +
            this.pagePath +
            "?nowPage=" +
            (this.nowBlock * this.pagePerBlock + i) +
            "'>" +
            (this.nowBlock * this.pagePerBlock + i + 1) +
            "</a>&nbsp;";
        }
        //모든 경우에 pagePerBlock만큼 반복되지 않으므로 break처리해야 함.
        //주의할 것.
        if (this.nowBlock * this.pagePerBlock + i + 1 == this.totalPage) break;
      }
      //현재 블록에서 다음 블록이 존재할 경우 이미지 추가하고 페이지 이동할 수 있도록
      //a태그 활용하여 링크 처리하기
      if (this.totalBlock > this.nowBlock + 1) {
        pageLink +=
          "&nbsp;&nbsp;<a href='" +
          this.pagePath +
          "?nowPage=" +
          (this.nowBlock + 1) * this.pagePerBlock +
          "'>";
        pageLink += "<img border=0 src='/images/bu_b.gif'>";
        pageLink += "</a>";
      }
    }
    this.pagination = pageLink;
  }
  //getter메소드 선언
  getPageBar() {
    this.setPageBar();
    return this.pagination;
  }
}

function dbtable() {
  const db = firebase.firestore();
  let num = 0;
  let total = 0;
  let numPerPage = 5;
  let nowPage = 0;
  let param = new URLSearchParams(document.location.search);
  nowPage = param.get("nowPage");

  db.collection("ntc")
    .where("cate", "in", ["이벤트", "지점별 안내"])
    .orderBy("write_date", "desc")
    .get()
    .then((snapshot) => {
      // console.log(snapshot); //[Object, Object] -> JSON.parse
      // console.log(JSON.stringify(snapshot));
      total = snapshot.docs.length;
      // console.log("전체레코드수==>" + total);
      for (
        let i = nowPage * numPerPage;
        i < nowPage * numPerPage + numPerPage;
        i++
      ) {
        if (total === i) break;
        num = i;
        // console.log(
        //   snapshot.docs[i].id + ", 제목" + snapshot.docs[i].data().subject
        // );

        const template = `
          <tr>
              <th scope="row">${++num}</th>
              <td>${snapshot.docs[i].data().cate}</td>
              // 수정으로 넘어가게 하는 모달창임 수정 없는 모달창은 그냥 cs-modal로
              <td><a class="cs_title" href="./cs_edit.html?id=${
                snapshot.docs[i].id
              }">
                ${snapshot.docs[i].data().subject}
              </a></td>
              <td class="write_d">${snapshot.docs[i].data().write_date}</td>
            </tr>
          `;
        $(".board-content").append(template);
      } //데이터 넣기
      $(".pagenation").append("");
      /*페이지 네비게이션 처리 위치*/
      const pagePath = "cs_notice.html";
      const pb = new PageBar(numPerPage, total, nowPage, pagePath);
      $(".pagenation").append(pb.getPageBar());
    });
}
function searchList() {
  const db = firebase.firestore();
  console.log("검색리스트에 도착했나요?");
  $("tbody").empty();
  const choice = $("#gubun option:selected").val();
  const user_search = $("#keyword").val();
  alert("검색" + choice + user_search);
  let num = 0;
  let total = 0;
  let numPerPage = 5;
  let nowPage = 0;
  let param = new URLSearchParams(document.location.search);
  nowPage = param.get("nowPage");

  db.collection("ntc")
    .where(choice, "==", user_search)
    // .orderBy("write_date", "desc")
    .get()
    .then((snapshot) => {
      // console.log(JSON.stringify(snapshot));
      total = snapshot.docs.length;
      // console.log("전체레코드수==>" + total);
      for (
        let i = nowPage * numPerPage;
        i < nowPage * numPerPage + numPerPage;
        i++
      ) {
        if (total === i) break;
        num = i;
        console.log(
          snapshot.docs[i].id + ", 제목" + snapshot.docs[i].data().subject
        );
        // snapshot.forEach((item) => {
        // console.log(doc.data())
        // 코드양은 늘어나더라도(DOM Tree구조는 잘 보임) 복잡도 증가하지 않도록
        const template = `
    <tr>
              <th scope="row">${++num}</th>
              <td>${snapshot.docs[i].data().cate}</td>
              // 수정으로 넘어가게 하는 모달창임 수정 없는 모달창은 그냥 cs-modal로
              <td><a href="./cs_edit.html?id=${snapshot.docs[i].id}">
                ${snapshot.docs[i].data().subject}
              </a></td>
              <td class="write_d">${snapshot.docs[i].data().write_date}</td>
            </tr>
          `;
        $(".board-content").append(template);
      }
    });
}
