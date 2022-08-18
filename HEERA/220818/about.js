
//////////////////////////////////////////////////////////// 추가
let firebaseEmailAuth; //파이어베이스 email 인증 모듈 전역변수
let firebaseDatabase; //파이어베이스 db 모듈 전역변수
let Name; //유저 이름
let loginUserKey; //로그인한 유저의 부모 key
let userInfo; //로그인한 유저의 정보 object type


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

//인증모듈 객체 가져오기
firebaseEmailAuth = firebase.auth();
//데이터베이스 모듈객체 가져오기
firebaseDatabase = firebase.database();

//세션 체크 함수
userSessionCheck();


//유저가 로그인 했는지 안했는지 확인해주는 함수
function userSessionCheck() {
  
  //로그인이 되어있으면 - 유저가 있으면, user를 인자값으로 넘겨준다.
  firebaseEmailAuth.onAuthStateChanged(function (user) {
    
    if (user) {
      //조회 - 데이터 베이스에 저장된 닉네임을 현재 접속되어 있는 user의 pk key 값을 이용해서 가져오기
      firebaseDatabase.ref("users/" + user.uid).once('value').then(function (snapshot) {
        
        //자바스크립트 dom 선택자를 통해서 네비게이션 메뉴의 엘리먼트 변경해주기
        document.getElementById("loginmenu").textContent = "로그아웃";
        // document.getElementById("loginmenu").href = "/logout.html";
        document.getElementById("loginmenu").addEventListener('click',()=>{
          // 로그아웃 기능구현하기
          firebase.auth().signOut().then(()=>{
            alert('로그아웃 되었습니다.');
            window.location.href = "./main.html";
          }).catch((error) => {
            console.log(error);
          });
        });
        document.getElementById("joinmenu").textContent = user.displayName + " 님";
        document.getElementById("joinmenu").addEventListener('click',()=>{
          // 마이페이지로 이동하기
          alert('마이페이지로 이동합니다.');
          window.location.href = "./mypage.html";
        });
        
        // Name = snapshot.val().name;   //유저 닉네임은 계속 쓸거기 때문에 전역변수로 할당
        loginUserKey = snapshot.key;  //로그인한 유저의 key도 계속 쓸 것이기 때문에 전역변수로 할당
        userInfo = snapshot.val(); //snapshot.val()에 user 테이블에 있는 해당 개체 정보가 넘어온다. userInfo에 대입!
        

        //alert(userInfo.userid);  //uid는 db에서 user 테이블의 각 개체들의 pk 인데, 이 값은 인증에서 생성된 아이디의 pk 값과 같다. *중요!

        return true
      });

    } else {
            $('#comment').val("로그인 하시면 사람들의 감사 리스트를 보실 수 있습니다. 로그인 해주실꺼죠^^?");
      return false
    }
  });
}

///////////////////////////////////////////////////////////////////////추가끝

/* <!-- Top 맨 위로 이동 버튼 --> */
  $(document).ready(function(){
    //Click event
    $('.top').click(function(){
    $('html, body').animate({scrollTop : 0},800);
    return false;
    });
  });