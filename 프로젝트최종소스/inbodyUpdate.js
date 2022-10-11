// 파이어베이스 연동 - 내 정보
const firebaseConfig = {
  apiKey: "AIzaSyDtVA_IYoYtVpeDuUF_UmKLFwOlg44CAic",
  authDomain: "terrgym-demo-bac70.firebaseapp.com",
  databaseURL: "https://terrgym-demo-bac70-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "terrgym-demo-bac70",
  storageBucket: "terrgym-demo-bac70.appspot.com",
  messagingSenderId: "679211028162",
  appId: "1:679211028162:web:d6839267c5c25146ccb55b"
};
// Initialize Firebase - 바로 호출하게 바꿔버림
firebase.initializeApp(firebaseConfig);
// 참조 만들기 - 파일 업로드, 다운로드, 삭제, 메타데이터 가져오기 또는 업데이트를 수행하기 위한 참조이다
const db = firebase.firestore();
const storage = firebase.storage();

$(document).ready(function(){
  $("#staticBackdrop").modal("show");
  });


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
  const date = new Date();
  //로그인이 되어있으면 - 유저가 있으면, user를 인자값으로 넘겨준다.
  firebaseEmailAuth.onAuthStateChanged(function (user) {
    if (user) {
      //조회 - 데이터 베이스에 저장된 닉네임을 현재 접속되어 있는 user의 pk key 값을 이용해서 가져오기
      firebaseDatabase
        .ref("users/" + user.uid)
        .once("value")
        .then(function (snapshot) {
          loginUserKey = snapshot.key; //로그인한 유저의 key도 계속 쓸 것이기 때문에 전역변수로 할당
          userInfo = snapshot.val(); //snapshot.val()에 user 테이블에 있는 해당 개체 정보가 넘어온다. userInfo에 대입!
          return true;
        });
    } 

    console.log(user.uid);

    const db = firebase.firestore();
    const storage = firebase.storage();

    // 등록버튼 눌렀을 때 - 
    $("#register").click(function(){
      const file = document.querySelector("#inbody").files[0];
      const storageRef = storage.ref();
      const storagePath = storageRef.child("image/" + "인바디_" + user.displayName + "_" + Date() + "_" +  file.name);
      const uploadImg = storagePath.put(file);
      const write_date = date.toLocaleString("ko-kr");

      uploadImg.on(
        "state_change", null, (error) => {
          console.log(error);
        },
        //성공했을때 동작
        () => {
          uploadImg.snapshot.ref.getDownloadURL().then((url) => {
            
            db.collection("inbody")
            .add({
              date: write_date,
              inbody_url: url,
              user_uid: user.uid
            })
            .catch((error) => {
              console.log(error);
            });
            alert('인바디 사진 등록성공!');
            setTimeout(function () {
              window.location="mypage.html";
            }, 1000);
          });
        }
      );
    })
  });
}
