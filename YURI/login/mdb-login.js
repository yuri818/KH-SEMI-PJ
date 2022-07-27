var firebaseEmailAuth; //파이어베이스 email 인증 모듈 전역변수
var firebaseDatabase; //파이어베이스 db 모듈 전역변수
var userInfo; //가입한 유저의 정보. object 타입


// Your web app's Firebase configuration
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

//내가추가////////////////////////////////////////////////////////
firebaseEmailAuth = firebase.auth(); //파이어베이스 인증 객체
firebaseDatabase = firebase.database(); //파이어베이스 데이터베이스 객체

//제이쿼리를 사용한다.
$(document).ready(function(){

  //가입버튼 눌렀을 때
  $(document).on('click','.login',function(){
    //제이쿼리 선택자와 val() 함수를 이용해서 이메일,비밀번호 값을 가져온다. 
    var email = $('#email').val();
    var password = $('#password').val();
    alert("로그인 버튼 눌렸음" + email +":"+ password);

    //파이어베이스 이메일 로그인 함수
    firebaseEmailAuth.signInWithEmailAndPassword(email, password)
    .then(function(firebaseUser) {
      //성공하면 firebaseUser에 유저 정보 값이 담겨 넘어온다.
      loginSuccess(firebaseUser);
    })
    .catch(function(error) {
    // 실패했을 때 에러 처리
    alert(error);
    alert("로그인 실패");
    });
  });
});

//로그인 성공했을 때
function loginSuccess(firebaseUser){
  alert("로그인 성공");

  //로그인 성공한 유저 id 확인해 보기 - firebase database에 접근해서 데이터 조회 하는 함수
  firebaseDatabase.ref("users/"+firebaseUser.uid).once('value').then(function(snapshot){
  //alert(snapshot.val().name)
  });
  //메인 페이지로 이동
  window.location= "branch.html"
}

//내가추가////////////////////////////////////////////////////////


// // 로그인 관련
// const db = firebase.firestore();
// // 현재 로그인한 사용자 가져오기
// firebase.auth().onAuthStateChanged((user) => {
//   if (user) {
//     console.log(user.uid);
//     console.log(user.displayName); // 사용자 이름 받아와줌
//     // innerHTML이 jquery에서는 html
//     $("#displayName").html(user.displayName); 
//   }
// });

// $("#login").click(function(){
//   // 사용자가 입력한 이메일, 비번, 핸폰번호, 이름
//   const email = $("#email").val();
//   const password = $("#password").val();
//   firebase.auth().signInWithEmailAndPassword(email, password)
//   .then((result) => {
//     console.log(result.user);
//   });
// });
