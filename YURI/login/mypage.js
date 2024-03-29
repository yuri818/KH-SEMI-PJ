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
userSessionCheck();

const user = firebase.auth().currentUser;
const db = firebase.firestore();
const storage = firebase.storage();

function userSessionCheck() {
  //로그인이 되어있으면 - 유저가 있으면, user를 인자값으로 넘겨준다.
  firebaseEmailAuth.onAuthStateChanged(function (user) {
    if (user) {
      firebaseDatabase.ref("users/" + user.uid).once('value').then(function (snapshot) {
        //자바스크립트 dom 선택자를 통해서 네비게이션 메뉴의 엘리먼트 변경해주기
        document.getElementById("logout").textContent = "로그아웃";
        // document.getElementById("loginmenu").href = "/logout.html";
        document.getElementById("logout").addEventListener('click',()=>{
          // 로그아웃 기능구현하기
          firebase.auth().signOut().then(()=>{
            alert('로그아웃 되었습니다.');
            window.location = "branch.html";
          }).catch((error) => {
            console.log(error);
          });
        });
        document.getElementById("username").textContent = user.displayName + " 님";
        
        ////////////////////////정보가져오기 추가///////////////////////////////
        const docRef = db.collection("user").doc(user.uid);
        docRef.get().then((doc) => {
          if (doc.exists) {
            console.log("Document data:", doc.data());
            document.getElementById("user_name").textContent = "이름: "+ doc.data().Name;
            document.getElementById("user_id").textContent = "아이디: "+ doc.data().email;
            document.getElementById("user_phone").textContent = "전화번호: "+ doc.data().phoneNumber;
            document.getElementById("user_pw").textContent = "비밀번호: "+ doc.data().password;
          } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
          }
        }).catch((error) => {
          console.log("Error getting document:", error);
        });
        ////////////////////////정보가져오기 추가///////////////////////////////
        
        /////////////////////////스토리지 사진 정보/////////////////////////////////////
        let storageRef = firebase.storage().ref('image');
        storageRef.child('jkcat.png').getDownloadURL().then( url =>{
          console.log(url);
          $("#profile_img").attr("src", url);
        }).catch((error)=>{
          console.log(error);
        })
        /////////////////////////스토리지 사진 정보/////////////////////////////////////
        
        loginUserKey = snapshot.key;  //로그인한 유저의 key도 계속 쓸 것이기 때문에 전역변수로 할당
        userInfo = snapshot.val(); //snapshot.val()에 user 테이블에 있는 해당 개체 정보가 넘어온다. userInfo에 대입!
        ///////////////// 회원정보수정 모달창 띄우기///////////////////////////////////////////////////////////////////
        document.getElementById('user_update').addEventListener('click',()=>{
          window.location = "profilemodal.html";
        })
        ///////////////// 회원정보수정 모달창 띄우기///////////////////////////////////////////////////////////////////
        ///////////////// 회원탈퇴하기///////////////////////////////////////////////////////////////////
        document.getElementById("user_delete").addEventListener('click',()=>{
          user.delete().then(() => {
            alert('회원탈퇴되었습니다.');
            window.location = "branch.html"
          }).catch((error) => {
            console.log(error);
          });
          
        })
        
        ///////////////// 회원탈퇴하기///////////////////////////////////////////////////////////////////
        ///////////////// 인바디 상세조회 모달창 띄우기///////////////////////////////////////////////////////////////////
        document.getElementById('inbody').addEventListener('click',()=>{
          window.location = "inbodyModal.html";
        })
        document.getElementById('inbody_update').addEventListener('click',()=>{
          window.location = "inbodyUpdate.html";
        })
        storageRef.child('inbody.jpg').getDownloadURL().then( url =>{
          console.log(url);
          $("#inbody_img").attr("src", url);
        }).catch((error)=>{
          console.log(error);
        })
        ///////////////// 회원정보수정 모달창 띄우기///////////////////////////////////////////////////////////////////
        /* *************************1:1 문의 목록 불러오기 시작************************************ */
        searchList();
        function searchList() {
          ///////////////////=========================추가=======================================////////////////
          //==================== 페이징 처리에 필요한 변수 선언//////////////////////////
          db.collection("ntc")
            .where("writer", "==", "관리자")
            .get()
            .then((snapshot) => { // 콜백영역 - callback 함수
              total = snapshot.docs.length;
              for(let i=0; i<total; i++){
                if(total === i) break;
                num = i;
                const template =`
                                <div class="list-group-branch">
                                  <span class="list-group-item list-group-item-action">${snapshot.docs[i].data().subject}</span> 
                                  <button type="button" class="btn btn-primary btn-sm">상세보기</button>
                                </div>
                `
                $(".list-group").append(template);
              }////end of for
            })/////end of callback
        }//end of searchList()
        /* *************************1:1 문의 목록 불러오기   끝************************************ */
        return true
      });
    } else {
      alert('로그인이 필요한 서비스입니다.');
      return false
    }
  });
}