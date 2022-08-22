let firebaseEmailAuth; //파이어베이스 email 인증 모듈 전역변수
let firebaseDatabase; //파이어베이스 db 모듈 전역변수
let userInfo; //가입한 유저의 정보. object 타입

const firebaseConfig = {
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

const user = firebase.auth().currentUser;
const db = firebase.firestore();
const storage = firebase.storage(); 

function userSessionCheck() {

    //로그인이 되어있으면 - 유저가 있으면, user를 인자값으로 넘겨준다.
    firebaseEmailAuth.onAuthStateChanged(function (user) {
        if (user) {
            firebaseDatabase.ref("users/" + user.uid).once('value').then(function (snapshot) {
            //자바스크립트 dom 선택자를 통해서 네비게이션 메뉴의 엘리먼트 변경해주기
            document.getElementById("loginmenu").textContent = "로그아웃";
            // document.getElementById("loginmenu").href = "/logout.html";
            document.getElementById("loginmenu").addEventListener('click',()=>{
              // 로그아웃 기능구현하기
            firebase.auth().signOut().then(()=>{
                alert('로그아웃 되었습니다.');
                window.location = "main.html";
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


    // 화면과 모달에 가져오기 위해 파이어베이스에 purchase_view 컬렉션 만들어놓음
    db.collection("purchase_view")
    .orderBy("name","asc")
    .get()
    .then((snapshot) => {
    snapshot.forEach((item)=> {
    // console.log(item.data());
    // console.log(item.id);
    const p_name = item.data().name
    const price = item.data().price
    const modal_btn = `
                        <div class="row">
                        <div class="col-sm-8 p_name">${p_name}</div>
                        <button type="button" class="btn btn-light btn_ph"
                        id="${item.id}"
                        data-bs-toggle="modal" data-bs-target="#purchaseModal">
                        구매</button>
                        </div>`
    $(".container.text-center").append(modal_btn);

    // 구매 버튼 눌렀을때 해당 id값을 읽어와서 구매 모달창 띄우기
    document.getElementById(item.id).addEventListener('click', (e) => {
        // console.log(e.target.id);
        if(item.id == e.target.id){
            document.getElementById("p_name").textContent = "이용권 이름 : " + p_name;
            document.getElementById("price").textContent = "가격 : " + price;
        }
    })

    });
    
    // 모달창에서 상세보기 한 후 구매하기
document.getElementById('purchase_btn').addEventListener('click',(e) => {
        let purchase_date = new Date();
        let year = purchase_date.getFullYear(); // 년도
        let month = purchase_date.getMonth() + 1;  // 월
        let date = purchase_date.getDate();  // 날짜
        const p_name = $("#p_name").text(); // 이용권 이름
        const price = $("#price").text(); // 이용권 가격
        const duration_start = $("#duration_start").val(); // 이용 시작 기간
        const duration_end = $("#duration_end").val(); // 이용 끝 기간
        let payment = $('input[name=inlineRadioOptions]:checked').val(); // 결제수단
        const user_name = $("#user_name").val(); // 회원이름
        let p_branch = $(".form-select").val(); // 이용 지점

            db.collection("purchase").add({
                member: user.uid,
                p_name: p_name,
                price: price,
                duration: `${duration_start} ~ ${duration_end}`,
                payment: payment,
                user_name: user_name,
                p_branch: p_branch,
                purchase_date: `${year}년 ${month}월 ${date}일` // 결제한 시각
            })
            .then((docRef) => {
                // console.log("Document written with ID: ", docRef.id);
                window.location.reload(); // 구매 후 새로고침
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
            alert('구매되었습니다');
        });
        
    });
          loginUserKey = snapshot.key;  //로그인한 유저의 key도 계속 쓸 것이기 때문에 전역변수로 할당
          userInfo = snapshot.val(); //snapshot.val()에 user 테이블에 있는 해당 개체 정보가 넘어온다. userInfo에 대입!
        });
    } else {
        alert('로그인이 필요한 서비스입니다.');
        window.location = "main.html";
        return false
        }
    });
}