let firebaseEmailAuth; //파이어베이스 email 인증 모듈 전역변수
let firebaseDatabase; //파이어베이스 db 모듈 전역변수
let Name; //유저 이름
let loginUserKey; //로그인한 유저의 부모 key
let userInfo; //로그인한 유저의 정보 object type

//인증모듈 객체 가져오기
firebaseEmailAuth = firebase.auth();
//데이터베이스 모듈객체 가져오기
firebaseDatabase = firebase.database();

//세션 체크 함수
userSessionCheck();

function userSessionCheck() {
  //로그인이 되어있으면 - 유저가 있으면, user를 인자값으로 넘겨준다.
  firebaseEmailAuth.onAuthStateChanged(function (user) {
    if (user) {
      //조회 - 데이터 베이스에 저장된 닉네임을 현재 접속되어 있는 user의 pk key 값을 이용해서 가져오기
      firebaseDatabase
      .ref("users/" + user.uid)
      .once("value")
      .then(function (snapshot) {
        ///////// 로그인한 아이디 레벨 확인, 권한 부여 /////////////
            const db = firebase.firestore();
            const docRef = db.collection("user").doc(user.uid);
            docRef.get().then((doc) => {
              if (doc.exists) {
                // 로그인 계정의 정보 콘솔에 출력하는 코드
                // console.log("Document data:", doc.data());

                // 관리자는 레벨 5를 부여하여 회원과 구분함
                if(doc.data().level > 1){
                  const hidden2 = document.querySelector("#delete_complete");
                  hidden2.style.cssText ="";
                  console.log("관리자 계정 확인, 숨겨진 버튼 보여줄게");
                } else if(doc.data().level == 1){
                  const hidden1 = document.querySelector("#modifying-btn");
                  const hidden2 = document.querySelector("#delete_complete");
                  hidden1.style.cssText ="";
                  hidden2.style.cssText ="";
                  console.log("회원 계정 확인, 숨겨진 버튼 보여줄게");
                  
                } else console.log("비회원 확인");
              } else {
              }
            }).catch((error) => {
              console.log("에러 발생: ", error);
            });     
            
            loginUserKey = snapshot.key; //로그인한 유저의 key도 계속 쓸 것이기 때문에 전역변수로 할당
            userInfo = snapshot.val(); //snapshot.val()에 user 테이블에 있는 해당 개체 정보가 넘어온다. userInfo에 대입!
            
            
            // 첫 번째 모달창
            // 화면이 렌더링되는 것과 스크립트 처리사이에 시간차
            $(document).ready(function () {
              const db = firebase.firestore();
              let params = new URLSearchParams(document.location.search);
              let id = params.get("id"); //문자열 "Jonathan"
              // console.log("사용자가 선택한 item.id: " + id);
              $("#exampleModal").modal("show");
              const readModal = document.getElementById("exampleModal");
              readModal.addEventListener("shown.bs.modal", () => {
                db.collection("QNA")
                  .doc(id)
                  .get()
                  .then((result) => {
                    // console.log(result.data());
                    if(user.uid == result.data().uid){
                      const subject = result.data().subject;
                      $("#exampleModalLabel").text(subject);
                      const writer = result.data().writer;
                      $("#writer").text(writer);
                      const write_date = result.data().write_date;
                      $("#write_date").text(write_date);
                      const content = result.data().content;
                      $("#content").text(content);
                      console.log("uid가 일치합니다.");
                    } else if (user.uid === "PEpN5J2VmjQLBy9NmvhHM6xox4r2"){
                      const subject = result.data().subject;
                      $("#exampleModalLabel").text(subject);
                      const writer = result.data().writer;
                      $("#writer").text(writer);
                      const write_date = result.data().write_date;
                      $("#write_date").text(write_date);
                      const content = result.data().content;
                      $("#content").text(content);
                      console.log("관리자 접근, 데이터 공개");
                    } else {
                            alert("작성자만 확인할 수 있는 글입니다.");
                            history.back();
                            return false;
                    }
                  });
              });
            });
            return true;
      });
    } else {
      alert("접근 권한이 없는 페이지입니다.");
      history.back();
      return false;
    }
  });
}


// 두번째 모달창
// 화면이 렌더링되는 것과 스크립트 처리사이에 시간차
$(document).ready(function () {
  //수정하기하면 화면에 값이 보여지고 제목과 내용은 인풋으로 보여지기
  document.getElementById("modifying-btn").onclick = () => {
    console.log("수정 넘어왔나요?");
    const db = firebase.firestore();
    let params = new URLSearchParams(document.location.search);
    //모달2도 모달1과 같은 url이라 똑같이 가져옴
    let id = params.get("id");
    console.log(id);
    $("#exampleModalToggle").modal("show");
    const readModal2 = document.getElementById("exampleModalToggle");
    readModal2.addEventListener("shown.bs.modal", () => {
      db.collection("QNA")
        .doc(id)
        .get()
        .then((result) => {
          console.log(result.data());
          //인풋이기 때문에 밸류값으로 가져옴, content도 동일
          const subject = result.data().subject;
          $("#input-title2").val(subject);
          const writer = result.data().writer;
          $("#writer2").text(writer);
          const write_date = result.data().write_date;
          $("#write_date2").text(write_date);
          const content = result.data().content;
          $("#input-content2").val(content);
        });
    });
  };
});

$(document).ready(function () {	
  //수정하기하면 화면에 값이 보여지고 제목과 내용은 인풋으로 보여지기	
  document.getElementById("modifying-btn").onclick = () => {	
    console.log("수정 넘어왔나요?");	
    const db = firebase.firestore();	
    let params = new URLSearchParams(document.location.search);	
    //모달2도 모달1과 같은 url이라 똑같이 가져옴	
    let id = params.get("id");	
    console.log(id);	
    $("#exampleModalToggle").modal("show");	
    const readModal2 = document.getElementById("exampleModalToggle");	
    readModal2.addEventListener("shown.bs.modal", () => {	
      db.collection("QNA")	
        .doc(id)	
        .get()	
        .then((result) => {	
          console.log(result.data());	
          //인풋이기 때문에 밸류값으로 가져옴, content도 동일	
          const subject = result.data().subject;	
          $("#input-title2").val(subject);	
          const writer = result.data().writer;	
          $("#writer2").text(writer);	
          const write_date = result.data().write_date;	
          $("#write_date2").text(write_date);	
          const content = result.data().content;	
          $("#input-content2").val(content);	
        });	
    });	
  };	
});

// 수정완료버튼
$(document).ready(function () {
  document.getElementById("modify_complete").onclick = () => {
    console.log("수정완료 넘어왔나요?");
    const db = firebase.firestore();
    let params = new URLSearchParams(document.location.search);
    //모달2도 모달1과 같은 url이라 똑같이 가져옴
    let id = params.get("id");
    console.log(id);
    const moRef = db.collection("QNA").doc(id);
    // 파이어베이스는 수정하는 항목을 따로 지정해주어야함
    // 일단 타이틀이랑 내용만 수정할 수 있게 해둠
    return moRef
      .update({
        // input이니까 밸류값
        subject: $("#input-title2").val(),
        content: $("#input-content2").val(),
      })
      .then(() => {
        console.log("Document successfully updated!");
      })
      .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });
      
  };
});

// 삭제버튼
$(document).ready(function () {
  document.getElementById("delete_complete").onclick = () => {
    console.log("삭제 넘어왔나요?");
    const db = firebase.firestore();
    let params = new URLSearchParams(document.location.search);
    //모달2도 모달1과 같은 url이라 똑같이 가져옴
    let id = params.get("id");
    console.log(id);
    //파이어베이스 삭제는 .delete()만 추가하면 됨 짱
    db.collection("QNA")
      .doc(id)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
      setTimeout(function () {
        window.location = "cs_personal.html";
      }, 1000);
  };
});

$(document).ready(function () {
  //어떤버튼을 누르든 상관없이 모달 2가 꺼지면 리로드
  //히든될때마다 리로드돼서 첫번째모달에선 못씀
  $("#exampleModalToggle").on("hidden.bs.modal", function () {
    console.log("모달2에서 첫창 넘어왔나요?");
    location.href = "cs_personal.html";
  });

  document.getElementById("mo1-close").onclick = () => {
    console.log("버튼 누르고 첫창 넘어왔나요?");
    history.back();
  };
});
