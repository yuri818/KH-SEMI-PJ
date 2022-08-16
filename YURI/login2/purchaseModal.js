const firebaseConfig = { // 개인 key 값
  apiKey: "AIzaSyDtVA_IYoYtVpeDuUF_UmKLFwOlg44CAic",
  authDomain: "terrgym-demo-bac70.firebaseapp.com",
  databaseURL: "https://terrgym-demo-bac70-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "terrgym-demo-bac70",
  storageBucket: "terrgym-demo-bac70.appspot.com",
  messagingSenderId: "679211028162",
  appId: "1:679211028162:web:d6839267c5c25146ccb55b"
};
firebase.initializeApp(firebaseConfig);
firebaseEmailAuth = firebase.auth(); //파이어베이스 인증 객체
firebaseDatabase = firebase.database(); //파이어베이스 데이터베이스 객체
userSessionCheck(); 


function userSessionCheck() {
  //로그인이 되어있으면 - 유저가 있으면, user를 인자값으로 넘겨준다.
  firebaseEmailAuth.onAuthStateChanged(function (user) {
    if (user) {
      firebaseDatabase.ref("users/" + user.uid).once('value').then(function (snapshot) {
        /////////////////////////////////////////모달창에 값 전달////////////////////////////////
        // 화면이 렌더링 되는 것과 스크립트 처리 사이의 시간차
        $(document).ready(function(){
          const db = firebase.firestore();
          $("#exampleModal").modal("show")
          const readModal = document.getElementById("exampleModal");
          readModal.addEventListener("shown.bs.modal", () => {
            const user = firebase.auth().currentUser;
            let num = 0;
            db.collection("purchase")
            .where("member", "==", user.uid)
            .get()
            .then((snapshot) =>{
              snapshot.forEach((doc)=>{
                const user_name = doc.data().user_name; 
                const price = doc.data().price;
                const payment = doc.data().payment;
                const p_name = doc.data().p_name;
                const branch = doc.data().p_branch;
                const duration = doc.data().duration;
                const template = `
                <h4 style="color: slateblue;"> <${++num} 번째 구매내역></h4>
                <label>회원명:  </label>
                <span>${user_name}</span>
                <br>
                <label>지점명: </label>
                <span>${branch}</span>
                <br>
                <label>결제수단: </label>
                <span>${payment}</span>
                <br>
                <label> </label>
                <span>${p_name}</span>
                <br>
                <label> </label>
                <span>${price}</span>
                <br>
                <label>등록 기간: </label>
                <span>${duration}</span>
                <hr>
                `
                $(".modal-body").append(template);
              })
            })
          })
        })
        return true
      });
    } else {
      alert('로그인이 필요한 서비스입니다.');
      return false
    }
  });
}