let myChartOne = document.getElementById('myChartOne').getContext('2d');
let myChartTwo = document.getElementById('myChartTwo').getContext('2d');
let myChartThree = document.getElementById('myChartThree').getContext('2d');
let myChartFour = document.getElementById('myChartFour').getContext('2d');

let barChartOne = new Chart(myChartOne, {
  //chartjs에서 정의하고 있는 타입 넣어주기
  type : 'line', //pie, line, doughnut, polarArea 등등...
  data : {
    labels : ['1주차', '2주차', '3주차', '4주차'],
    datasets : [{
      label : '2022 7월 매출액',
      data : [
        3200000,
        2000000,
        2500000,
        2800000
      ],
      borderColor: 'deeppink'
    }]
  }
})

let barChartTwo = new Chart(myChartTwo, {
  //chartjs에서 정의하고 있는 타입 넣어주기
  type : 'bar', //pie, line, doughnut, polarArea 등등...
  data : {
    labels : ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월' ,'11월', '12월'],
    datasets : [{
      label : 'dagym 2021년 월간 매출액',
      data : [
        20000000,
        14000000,
        12000000,
        10000000,
        16000000,
        14000000,
        15000000,
        12000000,
        9000000,
        8400000,
        8600000,
        8000000
      ],
      backgroundColor:[
        'rgba(255, 99, 132, 0.2)', //red
                'rgba(54, 162, 235, 0.2)', //blue
                'rgba(255, 206, 86, 0.2)', //yellow
                'rgba(75, 192, 192, 0.2)', //green
                'rgba(153, 102, 255, 0.2)', //purple
                'rgba(255, 159, 64, 0.2)' //orange
      ],
      borderWidth: 2,
      borderColor: '#aaa',
      hoverBorderWidth: 5,
    }]
  }
})

let barChartThree = new Chart(myChartThree, {
  type : 'line', //pie, line, doughnut, polarArea 등등...
  data : {
    labels : ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월' ,'11월', '12월'],
    datasets : [
      {
      label : 'dagym 2020매출액',
      data : [
        20000000,
        11000000,
        9000000,
        13000000,
        18000000,
        16000000,
        12000000,
        7900000,
        8800000,
        8900000,
        9100000,
        10000000
      ],
      backgroundColor:[
        'rgba(54, 162, 235, 0.2)'
      ],
      borderWidth: 2,
      borderColor: 'aqua',
      hoverBorderWidth: 5
    },
    {
      label : 'dagym 2021 매출액',
      data : [
        20000000,
        14000000,
        12000000,
        10000000,
        16000000,
        14000000,
        15000000,
        12000000,
        9000000,
        8400000,
        8600000,
        8000000
      ],
      backgroundColor:[
        'rgba(255, 99, 132, 0.2)'
      ],
      borderWidth: 2,
      borderColor: 'yellowgreen',
      hoverBorderWidth: 5
    }]
  },
  options: {
    plugins: {

    },
    elements: {
      line: {
        borderCapStyle: 'round',
        borderJoinStyle: 'bevel' // 꺾이는 모서리를 둥글게
      },
      point: {
        pointStyle: 'circle'
      }
    }
  }
});


let barChartFour = new Chart(myChartFour, {
    type: 'bar',
    data: {
        labels: ['2019', '2020', '2021', '2022'],
        datasets: [{
            label: '최근 4년 매출 현황',
            data: [
              124000000,
              143700000,
              147000000,
              97000000
            ],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)', //red
                'rgba(54, 162, 235, 0.2)', //blue
                'rgba(255, 206, 86, 0.2)', //yellow
                'rgba(75, 192, 192, 0.2)', //green
                'rgba(153, 102, 255, 0.2)', //purple
                'rgba(255, 159, 64, 0.2)' //orange
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
      scales: {
            y: {
                beginAtZero: true
            }
        },
        plugins: {
          tooltip: {
            enabled: true
          }
        }
    }
});