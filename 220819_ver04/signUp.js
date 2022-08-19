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
// 등록버튼 눌렀을 때 - 
$("#register").click(function(){
  const file = document.querySelector("#image").files[0];
  const storageRef = storage.ref();
  const storagePath = storageRef.child("image/"+file.name);
  const uploadImg = storagePath.put(file);
  uploadImg.on("state_change", null,(error) => {
    console.log(error);
  },
  // 성공했을 때 동작
  () => {
    uploadImg.snapshot.ref.getDownloadURL().then((url)=>{
      console.log(url);
    })
  }
  )
  // 사용자가 입력한 이메일, 비번, 이름, 핸폰번호
  const email = $("#email").val();
  const password = $("#password").val();
  const Name = $("#Name").val();
  const phoneNumber = $("#phoneNumber").val();
  const gender = $("input:radio[name='inlineRadioOptions']:checked").val();
  // firebas.auth()는 인증을 위해 필요한 데이터 모듈
  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((result) => {
    console.log(result.user);
    const userInfo = {
      email: email,
      phoneNumber: phoneNumber,
      Name: Name,
      password: password,
      gender: gender,
      // 모든 회원은 레벨1을 가진다
      level: 1
    };
    db.collection('user').doc(result.user.uid).set(userInfo);
    result.user.updateProfile({displayName: Name, phoneNumber: phoneNumber}).then((displayName) => {
      console.log("displayName => "+Name);
    });
    alert('회원가입 성공!');
    // 회원가입하자마자 로그인 폼으로 넘어가게한다
    setTimeout(() => {
      window.location="main.html";
    }, 1500);
  })
  .catch((error) => {
    console.log(error);
  })
});

