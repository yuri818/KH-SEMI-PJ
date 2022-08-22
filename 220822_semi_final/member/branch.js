let firebaseEmailAuth; //파이어베이스 email 인증 모듈 전역변수
let firebaseDatabase; //파이어베이스 db 모듈 전역변수
let Name; //유저 이름
let loginUserKey; //로그인한 유저의 부모 key
let userInfo; //로그인한 유저의 정보 object type

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

//인증모듈 객체 가져오기
firebaseEmailAuth = firebase.auth();
//데이터베이스 모듈객체 가져오기
firebaseDatabase = firebase.database();

//세션 체크 함수
userSessionCheck();


//유저가 로그인 했는지 안했는지 확인해주는 함수
function userSessionCheck() {
  //로그인이 되어있으면 - 유저가 있으면, user를 인자값으로 넘겨준다.
  firebaseEmailAuth.onAuthStateChanged(function (user) {
    if (user) {
      //조회 - 데이터 베이스에 저장된 닉네임을 현재 접속되어 있는 user의 pk key 값을 이용해서 가져오기
      firebaseDatabase.ref("users/" + user.uid).once('value').then(function (snapshot) {
        //자바스크립트 dom 선택자를 통해서 네비게이션 메뉴의 엘리먼트 변경해주기
        document.getElementById("loginmenu").textContent = "로그아웃";
        // document.getElementById("loginmenu").href = "/logout.html";
        document.getElementById("loginmenu").addEventListener('click',()=>{
          // 로그아웃 기능구현하기
          firebase.auth().signOut().then(()=>{
            alert('로그아웃 되었습니다.');
            window.location = "branch.html";
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
        loginUserKey = snapshot.key;  //로그인한 유저의 key도 계속 쓸 것이기 때문에 전역변수로 할당
        userInfo = snapshot.val(); //snapshot.val()에 user 테이블에 있는 해당 개체 정보가 넘어온다. userInfo에 대입!
        //alert(userInfo.userid);  //uid는 db에서 user 테이블의 각 개체들의 pk 인데, 이 값은 인증에서 생성된 아이디의 pk 값과 같다. *중요!
        return true
      });
    } else {
            $('#comment').val("로그인 하시면 사람들의 감사 리스트를 보실 수 있습니다. 로그인 해주실꺼죠^^?");
      return false
    }
  });
}

/* <!-- Top 맨 위로 이동 버튼 --> */
  $(document).ready(function(){
    //Click event
    $('.top').click(function(){
    $('html, body').animate({scrollTop : 0},800);
    return false;
    });
  });

/* **************************검색기능 추가************************** */
button = document.querySelector('.btn.btn-outline-primary');
input = document.getElementById('search_value')

function searchlist(){
  let value , item , name
    
  value = document.getElementById('search_value').value.toUpperCase();
  item = document.getElementsByClassName('list-group-branch')
    
  //indexOf()를 활용한 검색기능 구현
  for(i=0;i<item.length;i++){
      name = item[i].querySelectorAll(".list-group-item.list-group-item-action");
      if(name[0].innerHTML.toUpperCase().indexOf(value) > -1){
        item[i].style.display = "flex";
      }else{
        item[i].style.display = "none";
      }
    }
  }  // searchlist 함수 끝
  /* **************************검색기능 추가************************** */

// 클릭,엔터키 이벤트 
// input.focus()
// 엔터했을 경우도 동일하게 처리
input.addEventListener('keydown', (e) => {
  //console.log('key');
  if(e.keyCode == 13){
    //alert('엔터');
    searchlist();
  }
});

button.addEventListener('click',searchlist);

/* 지점 상세보기 버튼 이벤트 */
document.getElementById('btn_detail_ys').addEventListener('click',()=>{
  window.location ="branch_detail_ys.html";
});
/* 지점 상세보기 버튼 이벤트 */


///////////////클릭시 지도 이동 추가//////////////////////////
let map = null;
function initMap(pointx,pointy,click) {
	let x = (!pointx) ? 37.49901672299171 : pointx;
	let y = (!pointy) ? 127.03286906698669: pointy;

	const mapContainer = document.getElementById('map'), // 지도를 표시할 div
		mapOption = {
			center: new kakao.maps.LatLng(x, y), // 지도의 중심좌표
			level: 3 // 지도의 확대 레벨
		};
	let map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

	// 마커가 표시될 위치입니다
	let markerPosition  = new kakao.maps.LatLng(x, y);

  let imageSrc = 'https://static.thenounproject.com/png/886414-200.png', // 마커이미지의 주소입니다    
    imageSize = new kakao.maps.Size(64, 69), // 마커이미지의 크기입니다
    imageOption = {offset: new kakao.maps.Point(27, 69)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
      
  // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
  let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption)

	// 마커를 생성합니다
	let marker = new kakao.maps.Marker({
		position: markerPosition,
    image: markerImage // 마커이미지 설정
	});
	// 마커가 지도 위에 표시되도록 설정합니다
	marker.setMap(map);
// resizing 될 때 마커 위치 고정
$(window).on('resize', function() {
  let markerPosition = marker.getPosition(); 
  map.relayout();
  map.setCenter(markerPosition);
});

// 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
let zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
  // 클릭시 줌 컨트롤이 이중으로 나오는 것을 방지함
	if(click == 1){
		$("html, body").animate({ scrollTop: 0 }, 500, "")	
    map.removeControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
  }

}
initMap('37.49901672299171','127.03286906698669',0);

