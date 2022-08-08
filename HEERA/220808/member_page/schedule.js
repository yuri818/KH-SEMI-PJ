

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



document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
      // full-calendar 생성하기
    const calendar = new FullCalendar.Calendar(calendarEl, {
        // height: '700px', // calendar 높이 설정
        expandRows: true, // 화면에 맞게 높이 재설정
        themeSystem: 'bootstrap5.2.0',
        timeZone: 'UTC',
        // 해더에 표시할 툴바
/*     headerToolbar: {
        // 강좌 일정 등록 (관리자에게만 보이기)
        center: 'addEventButton'
    }, */
        // weekNumbers: true,
        // initialView: 'dayGridMonth', // 초기 로드 될때 보이는 캘린더 화면(기본 설정: 달)
        /* initialDate: '2022-08-15', */ // 초기 날짜 설정 (설정하지 않으면 오늘 날짜가 보인다.)
        editable: true, // 수정 가능?
        selectable: true, // 달력 일자 드래그 설정가능
        // nowIndicator: true, // 현재 시간 마크
        dayMaxEvents: true, // 이벤트가 오버되면 높이 제한 (+ 몇 개식으로 표현)
        locale: 'ko', // 한국어 설정
        eventAdd: function(obj) { // 이벤트가 추가되면 발생하는 이벤트
            console.log(obj);
        },
/*         eventChange: function(obj) { // 이벤트가 수정되면 발생하는 이벤트
            console.log(obj);
        },
        eventRemove: function(obj){ // 이벤트가 삭제되면 발생하는 이벤트
            console.log(obj);
        }, */
        eventClick:function(obj){ // 이벤트가 클릭되면 예약되는 이벤트 -> firestore class에 고객데이터 저장
            alert('예약되었습니다!');
            console.log(obj);
        },
select: function(arg) { // 캘린더에서 날짜 클릭으로 클래스 생성 (관리자에게만 활성화하기)
            const title = prompt('Event Title:');
            if (title) {
            calendar.addEvent({
                title: title,
                start: arg.start,
                allDay: arg.allDay
            })
            calendar_db.collection("classtime").add({
                class_name: title,
                class_date: arg.start,
            })
            .then((docRef) => {
                console.log("Document written with ID: ", docRef.id);
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
            }
            calendar.unselect()
        },
events: [
            calendar_db.collection("classtime")
            .get()
            .then((snapshot) => {
            snapshot.forEach((item)=> {
                //console.log(item.data());
/*                 let f_timestamp = item.data().class_date.toDate();
                //let birthday = new Date(f_timestamp);
                let b_year = f_timestamp.getFullYear();
                let b_month = f_timestamp.getMonth()+1;
                let b_date = f_timestamp.getDate();
                let f_date = b_year+'-'+b_month+'-'+b_date; */
                //console.log(f_date);
                calendar.getEvents({
                    //start: item.data().class_date.toDate()
                    title: `'${item.data().class_name}'`,
                    start: `'${item.data().class_date}'`
                    })
                    console.log(item.data().class_name);
                    console.log(item.data().class_date);
                })
            })
            .catch((error)=>{
                console.log(error);
            }),
            {
                title: '스피닝',
                start: '2022-08-20',
            }
        ]
        /* {
            groupId: 999,
            title: '스피닝',
            start: '2022-08-20',
            color: 'blue',   // an option!
            textColor: 'white' // an option!
            },
            {
            groupId: 999,
            title: '필라테스',
            start: '2022-08-03T16:00:00',
            color: 'yellow'
            },
            {
            title: 'Click for Google',
            url: 'http://google.com/', // 클릭시 해당 url로 이동
            start: '2022-08-29',
            color: 'blue',   // an option!
            textColor: 'white' // an option!
            }, 
            */
        });
      // 캘린더 랜더링
        calendar.render();
    });