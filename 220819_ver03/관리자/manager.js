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

const db = firebase.firestore();
    let num = 0;
    db.collection("user")
    .orderBy("Name", "asc")
    .get()
    .then((snapshot)=> {
      snapshot.forEach((doc)=>{
          const template=`
                          <tr>
                            <th scope="row">${++num}</th>
                            <td><a href="./manager_member_read.html?id=${doc.id}" data-bs-toggle="modal">
                                ${doc.data().Name}</a></td>
                            <td>${doc.data().phoneNumber}</td>
                            <td>${doc.data().gender}</td>
                          </tr>
          `
          $(".table-group-divider").append(template);
          // console.log(doc.data());
        })
      })

/* ******************검색기능********************************* */
function searchList(){
  const search = $("#keyword").val();

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
                          <th scope="row">${++num}</th>
                          <td><a href="./manager_member_read.html?id=${doc.id}" data-bs-toggle="modal">
                              ${doc.data().Name}</a></td>
                          <td>${doc.data().phoneNumber}</td>
                          <td>${doc.data().gender}</td>
                        </tr>
        `
        $(".table-group-divider").append(template);
      })
    })
}
/* ******************검색기능********************************* */