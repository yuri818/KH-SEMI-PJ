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

const db = firebase.firestore();
const storage = firebase.storage();

$(document).ready(function(){
  $("#staticBackdrop").modal("show");
  /////////////////////////스토리지 사진 정보/////////////////////////////////////
  let storageRef = firebase.storage().ref('image');
  storageRef.child('attendance.jpg').getDownloadURL().then( url =>{
    console.log(url);
    $("#attendance_img").attr("src", url);
  }).catch((error)=>{
    console.log(error);
  })
  /////////////////////////스토리지 사진 정보/////////////////////////////////////
});