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

// 등록버튼 눌렀을 때 - 
$("#register").click(function(){
  const file = document.querySelector("#attendance").files[0];
  const storageRef = storage.ref();
  const storagePath = storageRef.child("image/"+file.name);
  const uploadImg = storagePath.put(file);
  uploadImg.on("state_change", null,(error) => {
    console.log(error);
  },
  // 성공했을 때 동작
  () => {
    uploadImg.snapshot.ref.getDownloadURL().then((url)=>{
      console.log("근태관리사진url: "+url);
      alert('근태 등록 성공!');
      window.location = "./manager_trainer.html";
    })
  })
})