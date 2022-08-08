const firebaseConfig = {
            apiKey: "AIzaSyAJUd-i9rP8jdDsyLOBt5_tk7oYvckByKk",
            authDomain: "semi-projet-e58d8.firebaseapp.com",
            databaseURL: "https://semi-projet-e58d8-default-rtdb.asia-southeast1.firebasedatabase.app",
            projectId: "semi-projet-e58d8",
            storageBucket: "semi-projet-e58d8.appspot.com",
            messagingSenderId: "174296285860",
            appId: "1:174296285860:web:1d2fd5bf6f5f1fc3fd5c31",
            measurementId: "G-36HEEGVCMN"
        };
firebase.initializeApp(firebaseConfig);
const calendar_db = firebase.firestore();

// 관리자가 수강 시간표 등록하기 (관리자만 보이기)
document.getElementById("save_class").addEventListener('click',()=>{
  const class_date = $("#recipient-name").val();
  const class_name = $("#class_name").val();
  calendar_db.collection("classtime").add({
      class_name: class_name,
      class_date: class_date
  })
  .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);
  })
  .catch((error) => {
      console.error("Error adding document: ", error);
  });

  
});


/////// 달력 ///////

let date = new Date();

const renderCalender = () =>{

  const viewYear = date.getFullYear();
  const viewMonth = date.getMonth();
  const viewDay = date.getDate();

  console.log(viewDay);
  
  document.querySelector('.year-month').textContent = `${viewYear}년 ${viewMonth+1}월`;
  
  const prevLast = new Date(viewYear, viewMonth, 0);
  const thisLast = new Date(viewYear, viewMonth +1 ,0);
  
  const PLDate = prevLast.getDate();
  const PLDay = prevLast.getDay();
  
  const TLDate = thisLast.getDate();
  const TLDay = thisLast.getDay();
  
  const prevDates = [];
  const thisDates = [...Array(TLDate + 1).keys()].slice(1);
  const nextDates = [];
  
  if(PLDay != 6){
    for(let i = 0; i < PLDay + 1; i++){
      prevDates.unshift(PLDate - i);
    }
  }
  
  for(let i = 1; i < 7 - TLDay; i++){
    nextDates.push(i);
  }
  
  const dates = prevDates.concat(thisDates, nextDates);
  const firstDateIndex = dates.indexOf(1);
  const lastDateIndex = dates.lastIndexOf(TLDate);



  dates.forEach((date, i) => {
    const condition = i >= firstDateIndex && i < lastDateIndex + 1
                      ? 'this'
                      : 'other';
    dates[i] = `<div class="date"><span class=${condition}>${date}</span></div>`;
  });

  document.querySelector('.dates').innerHTML = dates.join('');

  const today = new Date();
  if(viewMonth === today.getMonth() && viewYear === today.getFullYear()){
    for(let date of document.querySelectorAll('.this')){
      if(+date.innerText === today.getDate()){
        date.classList.add('today');
        break;
      }
    }
  }
};

renderCalender();

const prevMonth = () =>{
  date.setDate(1);
  date.setMonth(date.getMonth()-1);
  renderCalender();
};

const nextMonth = () =>{
  date.setDate(1);
  date.setMonth(date.getMonth()+1);
  renderCalender();
};

document.getElementById('btn_prev').addEventListener('click',()=>{
  prevMonth();
});

document.getElementById('btn_next').addEventListener('click',()=>{
  nextMonth();
});

   // 파이어베이스에 등록된 시간표 불러오기
  calendar_db.collection("classtime")
    .get()
    .then((snapshot) => {
snapshot.forEach((item)=> {
/*         console.log(item.data());
let f_month = item.data().class_date.substr(5, 2);
console.log(f_month);
let f_day = item.data().class_date.slice(-2);
console.log(f_day); */
const template = `
                  <div class="date">${item.data().class_date}</div>
                  <button class="reservation_btn">${item.data().class_name}</button>
                `
                $(".dates").append(template)
})
})
.catch((error)=>{
console.log(error);
})