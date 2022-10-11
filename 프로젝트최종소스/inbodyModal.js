const firebaseConfig = {
  apiKey: "AIzaSyDtVA_IYoYtVpeDuUF_UmKLFwOlg44CAic",
  authDomain: "terrgym-demo-bac70.firebaseapp.com",
  databaseURL: "https://terrgym-demo-bac70-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "terrgym-demo-bac70",
  storageBucket: "terrgym-demo-bac70.appspot.com",
  messagingSenderId: "679211028162",
  appId: "1:679211028162:web:d6839267c5c25146ccb55b",
  // measurementId: "G-5DV4JCJLPE"
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
            db.collection("inbody")
            .where("user_uid", "==", user.uid)
            .get()
            .then((snapshot) =>{
              snapshot.forEach((doc)=>{
                const date = doc.data().date;
                const inbody_url = doc.data().inbody_url;
                const inbody = `
                              <span class="class_date" style="font-weight: bold;">업로드 날짜: ${date}</span>
                              <br>
                              <img src="${inbody_url}" style="margin-top: 0.5rem; border-radius: 10px; max-width:100%; height:auto;">
                              <hr>
                              `;
                $(".modal-body").append(inbody);
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