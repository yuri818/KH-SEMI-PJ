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
            db.collection("reservationGX")
            .where("member", "==", user.uid)
            .get()
            .then((snapshot) =>{
              snapshot.forEach((doc)=>{
                const name = doc.data().수강과목; 
                const time = doc.data().시간;
                const date = doc.data().날짜;
                const dd = doc.data().요일;
                const lecturer = doc.data().강사;
                const template = `
                <h4 style="color: violet;"> <${++num} 번째 강좌></h4>
                <label> </label>
                <span class="class_name">${name}</span>
                <br>
                <label> </label>
                <span class="class_lecturer">${lecturer}</span>
                <br>
                <span class="class_date">${date}</span>
                <br>
                <span class="class_dd">${dd}</span>
                <br>
                <label> </label>
                <span class="class_time">${time}</span>
                <hr>
                `;
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