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

        // 관리자가 수강 시간표 등록하기 (관리자만 보이기)
        document.getElementById("save_class").addEventListener('click',()=>{
            const class_date = $("#class_date").val(); // 클래스 날짜
            let class_time = $("#floatingSelect").val(); // 클래스 시간
            let class_dd = $("#floatingSelect_dd").val(); // 클래스 요일
            let class_name = $("#floatingSelect_class").val(); // 수업 이름
            const class_lecturer = $("#class_lecturer").val(); // 강사명
            db.collection("classtime").add({ // classtime 컬렉션에 추가
                날짜: class_date,
                요일: class_dd,
                시간: class_time,
                수강과목: class_name,
                강사: class_lecturer,
            })
            .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
                alert('등록되었습니다!');
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
        });

        // 관리자가 수강 시간표(이미지) 올리기 (관리자만 보이기)
        document.getElementById('inputGroupFileAddon04').addEventListener('click', () => {
            console.log('이미지 업로드 버튼 클릭');

            const file = document.querySelector("#inputGroupFile04").files[0];
            let storageRef = storage.ref();
            const storagePath = storageRef.child("image/"+file.name);
            const uploadImg = storagePath.put(file);
            uploadImg.on("state_change", null, (error)=>{
                console.error(error)
            },
            // 성공했을 때 동작
            () => {
                uploadImg.snapshot.ref.getDownloadURL().then((url)=>{
                    console.log(url);

                })
            })
        })

        let storageRef = storage.ref('image');
        
        /////////////////////////스토리지 사진 불러오기/////////////////////////////////////
            storageRef.child('GXtimetable.png').getDownloadURL()
            .then((url) => {
                // `url` is the download URL for 'images/stars.jpg'
                // Or inserted into an <img> element
                let img = document.getElementById('class_img');
                img.setAttribute('src', url);
            })
            .catch((error) => {
                console.error(error);
            });
        /////////////////////////스토리지 사진 불러오기/////////////////////////////////////
/*         document.getElementById("inputGroupFile04").addEventListener('change', (e) => {
            console.log(e.target.files);

            let timetable_img = e.target.files[0]; //선택된 파일
            let reader = new FileReader();
            reader.readAsDataURL(timetable_img); //파일을 읽는 메서드 
            reader.onload = () => {
                $("#class_img").attr("src", reader.result);
            }
        }) */

//reservationGX - 자동id - 필드(날짜, 수업시간, 수업이름, 강사, 로그인한 유저의 uid)

    // 파이어베이스에 등록된 시간표 불러오기(전체)
    db.collection("classtime")
        .orderBy("날짜","asc")
        .get()
        .then((snapshot) => {
    snapshot.forEach((item)=> {
        console.log(item.data());
        const class_date = item.data().날짜 // 클래스 날짜
        const class_dd = item.data().요일 // 클래스 요일
        const class_time = item.data().시간 // 클래스 시간
        const class_name = item.data().수강과목 // 클래스 이름
        const class_lecturer = item.data().강사 // 강사명(모달 상세보기에서 보일것)
        const template = `
                <tr>
                    <td>${class_date}</td>
                    <td>${class_dd}</td>
                    <td>${class_time}</td>
                    <td>${class_name}</td>
                    <td><button type="button" class="btn btn-dark"
                    id="${item.id}"
                    data-bs-toggle="modal" data-bs-target="#reservation_modal">
                    상세보기</button></td>
                </tr>`
        $(".reservation_tbody").append(template)

        // 상세보기 버튼 눌렀을때 해당 id값을 읽어와서 상세보기 모달창 띄우기
        document.getElementById(item.id).addEventListener('click' , (e) => {
            console.log(e.target.id);
            if(item.id == e.target.id){
                //console.log(result.id)
            document.getElementById("res_date").textContent = "날짜 : " + class_date;
            document.getElementById("res_dd").textContent = "요일 : " + class_dd;
            document.getElementById("res_time").textContent = "시간 : " + class_time;
            document.getElementById("res_classname").textContent = "수강과목 : " + class_name;
            document.getElementById("res_lecturer").textContent = "강사 : " + class_lecturer;
            
            // 삭제하기 (관리자가 데이터 삭제, 관리자만 보이기)
            document.getElementById('del_data').addEventListener('click' , () => {
                db.collection("classtime")
                .doc(item.id)
                .delete()
                .then(() => {
                    alert('삭제되었습니다!');
                    window.location.reload(); // 삭제하고 새로고침
                    console.log("Document successfully deleted!");
                }).catch((error) => {
                    console.error("Error removing document: ", error);
                });
            })
            }
        });
    });
    
    //////////////// 수강과목 선택 카테고리 /////////////////
    function SearchCategory() {
        let total = 0 //전체 레코드 수
        let name_select_view = $("#name_select_view option:selected").val()
        db.collection("classtime")
            .where("수강과목", "==", name_select_view)
            .get()
            .then((snapshot) => {
                total = snapshot.docs.length
                if (total > 0) {
                    $(".reservation_tbody").text("")
                }
                snapshot.forEach((item) => {
                    const class_date = item.data().날짜 // 클래스 날짜
                    const class_dd = item.data().요일 // 클래스 요일
                    const class_time = item.data().시간 // 클래스 시간
                    const class_name = item.data().수강과목 // 클래스 이름
                    const class_lecturer = item.data().강사 // 강사명(모달 상세보기에서 보일것)
                    const template = `
                            <tr>
                                <td>${class_date}</td>
                                <td>${class_dd}</td>
                                <td>${class_time}</td>
                                <td>${class_name}</td>
                                <td><button type="button" class="btn btn-dark"
                                id="${item.id}"
                                data-bs-toggle="modal" data-bs-target="#reservation_modal">
                                상세보기</button></td>
                            </tr>`
                    $(".reservation_tbody").append(template)

        // 상세보기 버튼 눌렀을때 해당 id값을 읽어와서 상세보기 모달창 띄우기
        document.getElementById(item.id).addEventListener('click' , (e) => {
            console.log(e.target.id);
            if(item.id == e.target.id){
                //console.log(result.id)
            document.getElementById("res_date").textContent = "날짜 : " + class_date;
            document.getElementById("res_dd").textContent = "요일 : " + class_dd;
            document.getElementById("res_time").textContent = "시간 : " + class_time;
            document.getElementById("res_classname").textContent = "수강과목 : " + class_name;
            document.getElementById("res_lecturer").textContent = "강사 : " + class_lecturer;
            
            // 삭제하기 (관리자가 데이터 삭제, 관리자만 보이기)
            document.getElementById('del_data').addEventListener('click' , () => {
                db.collection("classtime")
                .doc(item.id)
                .delete()
                .then(() => {
                    alert('삭제되었습니다!');
                    window.location.reload(); // 삭제하고 새로고침
                    console.log("Document successfully deleted!");
                }).catch((error) => {
                    console.error("Error removing document: ", error);
                });
            })
            }
        });
            })
        })
    }
    //////////카테고리 선택시 함수 호출//////////////
    document.getElementById('name_select_view').addEventListener('change', () => {
        console.log('바뀌었나');
        SearchCategory();
    })

    ////////////////  날짜 검색 기능 /////////////////
    function SearchDate() {
        let total = 0 //전체 레코드 수
        let date_keyword = $("#date_keyword").val()
        db.collection("classtime")
            .where("날짜", "==", date_keyword)
            .get()
            .then((snapshot) => {
                total = snapshot.docs.length
                if (total > 0) {
                    $(".reservation_tbody").text("")
                }
                snapshot.forEach((item) => {
                    const class_date = item.data().날짜 // 클래스 날짜
                    const class_dd = item.data().요일 // 클래스 요일
                    const class_time = item.data().시간 // 클래스 시간
                    const class_name = item.data().수강과목 // 클래스 이름
                    const class_lecturer = item.data().강사 // 강사명(모달 상세보기에서 보일것)
                    const template = `
                            <tr>
                                <td>${class_date}</td>
                                <td>${class_dd}</td>
                                <td>${class_time}</td>
                                <td>${class_name}</td>
                                <td><button type="button" class="btn btn-dark"
                                id="${item.id}"
                                data-bs-toggle="modal" data-bs-target="#reservation_modal">
                                상세보기</button></td>
                            </tr>`
                    $(".reservation_tbody").append(template)

        // 상세보기 버튼 눌렀을때 해당 id값을 읽어와서 상세보기 모달창 띄우기
        document.getElementById(item.id).addEventListener('click' , (e) => {
            console.log(e.target.id);
            if(item.id == e.target.id){
                //console.log(result.id)
            document.getElementById("res_date").textContent = "날짜 : " + class_date;
            document.getElementById("res_dd").textContent = "요일 : " + class_dd;
            document.getElementById("res_time").textContent = "시간 : " + class_time;
            document.getElementById("res_classname").textContent = "수강과목 : " + class_name;
            document.getElementById("res_lecturer").textContent = "강사 : " + class_lecturer;
            
            // 삭제하기 (관리자가 데이터 삭제, 관리자만 보이기)
            document.getElementById('del_data').addEventListener('click' , () => {
                db.collection("classtime")
                .doc(item.id)
                .delete()
                .then(() => {
                    alert('삭제되었습니다!');
                    window.location.reload(); // 삭제하고 새로고침
                    console.log("Document successfully deleted!");
                }).catch((error) => {
                    console.error("Error removing document: ", error);
                });
            })
            }
        });
            })
        })
    }
    //////////날짜 검색 함수 호출//////////////
    document.getElementById('button-addon2').addEventListener('click', () => {
        console.log('검색되나');
        SearchDate();
    })


    // 모달창에서 상세보기 한 후 예약하기 -> 파이어베이스에 유저id값과 예약 정보 reservationGX에 넘어감
    document.getElementById('save_reservation').addEventListener('click',(e) => {

        const res_date = $("#res_date").text();
        const res_dd = $("#res_dd").text();
        const res_time = $("#res_time").text();
        const res_classname = $("#res_classname").text();
        const res_lecturer = $("#res_lecturer").text();
        console.log(res_date);
        console.log(res_time);

            db.collection("reservationGX").add({
                member: user.uid,
                날짜: res_date,
                요일: res_dd,
                시간: res_time,
                수강과목: res_classname,
                강사: res_lecturer
            })
            .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
                alert('예약되었습니다!');
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
        });
        
    });
          loginUserKey = snapshot.key;  //로그인한 유저의 key도 계속 쓸 것이기 때문에 전역변수로 할당
          userInfo = snapshot.val(); //snapshot.val()에 user 테이블에 있는 해당 개체 정보가 넘어온다. userInfo에 대입!
        });
    } else {
        alert('로그인이 필요한 서비스입니다.');
        return false
        }
    });
}