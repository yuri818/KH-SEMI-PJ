// firebase 데이트 끌어오기
const firebaseConfig = { // 개인 key 값
  apiKey: "AIzaSyAHLI5OD2wSYxiJYlMvJuiW8bK2xj6CaSk",
  authDomain: "kh-terrgym.firebaseapp.com",
  databaseURL: "https://kh-terrgym-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kh-terrgym",
  storageBucket: "kh-terrgym.appspot.com",
  messagingSenderId: "427262482569",
  appId: "1:427262482569:web:f89f88f3c2339ec8bf4e58"
};
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
    let num = 0;
    db.collection("members").get().then((snapshot)=> {
        snapshot.forEach((doc)=>{
          const template=`
                          <tr>
                            <th scope="row">${++num}</th>
                            <td><a href="./manager_member_read.html?id=${doc.id}" data-bs-toggle="modal">
                                ${doc.data().이름}</a></td>
                            <td>${doc.data().연락처}</td>
                            <td>${doc.data().등록지점}</td>
                          </tr>
          `
          $(".table-group-divider").append(template);
          // console.log(doc.data());
        })
      })

// 검색 기능 추가
button = document.querySelector('#btn_search');
input = document.getElementById('search_value')

function searchlist(){
  let value , item , name
    
  value = document.getElementById('search_value').value.toUpperCase();
  item = document.getElementsByClassName('modal-body')
    
  //indexOf()를 활용한 검색기능 구현
  for(i=0;i<item.length;i++){
      name = item[i].querySelectorAll(".name");
      if(name[0].innerHTML.toUpperCase().indexOf(value) > -1){
        item[i].style.display = "flex";
      }else{
        item[i].style.display = "none";
      }
    }

}  // searchlist 함수 끝

// 클릭,엔터키 이벤트 
input.focus()
// 엔터했을 경우도 동일하게 처리
/* input.addEventListener('keydown', (e) => {
  //console.log('key');
  if(e.key === "Enter"){
    alert('엔터');
    searchlist();
  }
}); */

button.addEventListener('click',searchlist);