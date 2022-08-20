// firebase 데이트 끌어오기
const firebaseConfig = { // 개인 key 값
  apiKey: "AIzaSyDtVA_IYoYtVpeDuUF_UmKLFwOlg44CAic",
  authDomain: "terrgym-demo-bac70.firebaseapp.com",
  databaseURL: "https://terrgym-demo-bac70-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "terrgym-demo-bac70",
  storageBucket: "terrgym-demo-bac70.appspot.com",
  messagingSenderId: "679211028162",
  appId: "1:679211028162:web:d6839267c5c25146ccb55b",
};
firebase.initializeApp(firebaseConfig);
dbtable();

/* **************************검색기능************************** */
function searchList(){
  const search = $("#keyword").val();
  const db = firebase.firestore();
  let num2 = 0;
  db.collection("user")
    .where("Name", "==", search)
    .get()
    .then((snapshot) => {
      total = snapshot.docs.length;
      if(total > 0){
        $(".table-group-divider").text("")
      }
      snapshot.forEach((doc)=>{
        const template=`
                        <tr>
                          <th scope="row">${++num2}</th>
                          <td><a href="./manager_member_read.html?id=${doc.id}" data-bs-toggle="modal">
                              ${doc.data().Name}</a></td>
                          <td>${doc.data().phoneNumber}</td>
                          <td>${doc.data().gender}</td>
                        </tr>
        `
        $(".table-group-divider").append(template);
      })
    })
    // 검색했을 경우 페이징처리 방지용코드 //
    document.getElementById('pagenation').style.display = 'none';
}
/* **************************검색기능************************** */

/* **************************페이징 처리************************** */
//전체레코드 갯수
class PageBar {
  totalRecord;
  //페이지당 레코드 수
  numPerPage; // 10개씩이다
  //블럭당 디폴트 페이지 수
  pagePerBlock = 5;
  //총페이지 수
  totalPage;
  //총블럭 수
  totalBlock;
  //현재 내가 바라보는 페이지 수
  nowPage;
  //현재 내가 바라보는 블럭 수
  nowBlock;
  //적용할 페이지 이름
  pagePath;
  pagination;
  // 자바와는 다르게 오버로딩을 지원하지 않음
  constructor(numPerPage, totalRecord, nowPage, pagePath) {
    this.numPerPage = numPerPage;
    this.totalRecord = totalRecord;
    //alert(totalRecord);
    this.nowPage = nowPage;
    this.pagePath = pagePath;
    this.totalPage = Math.ceil(this.totalRecord / this.numPerPage); // 47.0/10=> 4.7 4.1->5page 4.2->5page
    this.totalBlock = Math.ceil(this.totalPage / this.pagePerBlock); //5.0/2=> 2.5-> 3장
    //현재 내가바라보는 페이지 : (int)((double)4-1/2)
    this.nowBlock = Math.floor(this.nowPage / this.pagePerBlock);
  }
  //setter메소드 선언
  setPageBar() {
    // console.log("nowBlock:" + this.nowBlock);
    let pageLink = "";
    //전체 레코드 수가 0보다 클때 처리하기
    if (this.totalRecord > 0) {
      //nowBlock이 0보다 클때 처리
      //이전 페이지로 이동 해야 하므로 페이지 번호에 a태그를 붙여야 하고
      //pagePath뒤에 이동할 페이지 번호를 붙여서 호출 해야함.
      if (this.nowBlock > 0) {
        pageLink +=
          "<a style='color: black;' href='" +
          this.pagePath +
          "?nowPage=" +
          ((this.nowBlock - 1) * this.pagePerBlock + (this.pagePerBlock - 1)) +
          "'>";
        pageLink += "<img border=0 src='./images/bu_a.gif'>";
        pageLink += "</a>&nbsp;&nbsp;";
      }
      for (let i = 0; i < this.pagePerBlock; i++) {
        //현재 내가 보고 있는 페이지 블록 일때와
        if (this.nowBlock * this.pagePerBlock + i == this.nowPage) {
          pageLink +=
            "<b>" + (this.nowBlock * this.pagePerBlock + i + 1) + "</b>&nbsp;";
        }
        //그렇지 않을 때를 나누어 처리해야 함.
        else {
          pageLink +=
            "<a style='color: black;' href='" +
            this.pagePath +
            "?nowPage=" +
            (this.nowBlock * this.pagePerBlock + i) +
            "'>" +
            (this.nowBlock * this.pagePerBlock + i + 1) +
            "</a>&nbsp;";
        }
        //모든 경우에 pagePerBlock만큼 반복되지 않으므로 break처리해야 함.
        //주의할 것.
        if (this.nowBlock * this.pagePerBlock + i + 1 == this.totalPage) break;
      }
      //현재 블록에서 다음 블록이 존재할 경우 이미지 추가하고 페이지 이동할 수 있도록
      //a태그 활용하여 링크 처리하기
      if (this.totalBlock > this.nowBlock + 1) {
        pageLink +=
          "&nbsp;&nbsp;<a href='" +
          this.pagePath +
          "?nowPage=" +
          (this.nowBlock + 1) * this.pagePerBlock +
          "'>";
        pageLink += "<img border=0 src='/images/bu_b.gif'>";
        pageLink += "</a>";
      }
    }
    this.pagination = pageLink;
  }
  //getter메소드 선언
  getPageBar() {
    this.setPageBar();
    return this.pagination;
  }
}

function dbtable() {
  const db = firebase.firestore();
  let num = 0;
  let total = 0;
  let numPerPage = 5;
  let nowPage = 0;
  let param = new URLSearchParams(document.location.search);
  nowPage = param.get("nowPage");

  db.collection("user")
    .orderBy("Name", "asc")
    .get()
    .then((snapshot) => {
      total = snapshot.docs.length;
      for (
        let i = nowPage * numPerPage;
        i < nowPage * numPerPage + numPerPage;
        i++
      ) {
        if (total === i) break;
        num = i;
        const template=`
                        <tr>
                          <th scope="row">${++num}</th>
                          <td><a href="./manager_member_read.html?id=${snapshot.docs[i].id}" data-bs-toggle="modal">
                              ${snapshot.docs[i].data().Name}</a></td>
                          <td>${snapshot.docs[i].data().phoneNumber}</td>
                          <td>${snapshot.docs[i].data().gender}</td>
                        </tr>
        `
        $(".table-group-divider").append(template);
      } //데이터 넣기
      $(".pagenation").append("");
      /*페이지 네비게이션 처리 위치*/
      const pagePath = "manager_member.html";
      const pb = new PageBar(numPerPage, total, nowPage, pagePath);
      $(".pagenation").append(pb.getPageBar());
    });
}
/* **************************페이징 처리************************** */