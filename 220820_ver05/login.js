let firebaseEmailAuth; //파이어베이스 email 인증 모듈 전역변수
let firebaseDatabase; //파이어베이스 db 모듈 전역변수
let userInfo; //가입한 유저의 정보. object 타입


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

firebaseEmailAuth = firebase.auth(); //파이어베이스 인증 객체
firebaseDatabase = firebase.database(); //파이어베이스 데이터베이스 객체

//제이쿼리를 사용한다.
$(document).ready(function(){

  //가입버튼 눌렀을 때
  $(document).on('click','.login',function(){
    //제이쿼리 선택자와 val() 함수를 이용해서 이메일,비밀번호 값을 가져온다. 
    const email = $('#email').val();
    const password = $('#password').val();

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
  });
  //메인 페이지로 이동
  window.location= "main.html"
}

////////////////////////// google로그인 때문에 추가한 부분//////////////////////////////////////
// Google 제공업체 객체의 인스턴스를 생성합니다.
let goo_provider = new firebase.auth.GoogleAuthProvider();
document.getElementById('google').addEventListener('click', ()=> {
  console.log('구글로그인 버튼 눌림');
  firebase.auth().signInWithPopup(goo_provider)
  .then((result) => {
    console.log(result.user);
    // console.log('이메일은'+result.user.email);
    window.location="main.html";
  })
  .catch((error) => {
    console.log(error);
  })
});
////////////////////////// google로그인 때문에 추가한 부분//////////////////////////////////////

/////////////////////////////// 깃헙 로그인 구현 시작///////////////////////////////////
let git_provider = new firebase.auth.GithubAuthProvider();

document.getElementById('github').addEventListener('click', () => {
  console.log('깃허브로그인 버튼 눌림');
  firebase.auth().signInWithPopup(git_provider)
  .then((result) => {
    /** @type {firebase.auth.OAuthCredential} */
    let credential = result.credential;
    // This gives you a GitHub Access Token. You can use it to access the GitHub API.
    let token = credential.accessToken;
    // The signed-in user info.
    let user = result.user;
    window.location="main.html";
    console.log(user);
  }).catch((error) => {
    // Handle Errors here.
    let errorCode = error.code;
    let errorMessage = error.message;
    // The email of the user's account used.
    let email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    let credential = error.credential;
  })
})
/////////////////////////////// 깃헙 로그인 구현 끝////////////////////////////////////

/* 엔터쳤을 때 로그인하는 기능 추가 */
const button = document.getElementById('login');
const input = document.getElementById('password');

input.addEventListener('keydown', (e) => {
  // console.log('key');
  if(e.keyCode == 13){
    //제이쿼리 선택자와 val() 함수를 이용해서 이메일,비밀번호 값을 가져온다. 
    const email = $('#email').val();
    const password = $('#password').val();

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
  }
});
/* 엔터쳤을 때 로그인하는 기능 추가 */