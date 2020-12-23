export default function createChart(data, date) {
  
  let canvasChart = document.createElement('canvas');
  canvasChart.setAttribute('id', `${Math.random() * 100000}`);
  canvasChart.classList.add('created-chart'); 

  var ctx = canvasChart.getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: date,
      datasets: [{
        label: `Total ${data.status} in ${data.country} ${data.title}`,
        data: data.cases,
        backgroundColor: '#62d9d9',
        borderColor: '#62d9d9',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          },
        }]
      }
    }
  });

  return canvasChart;
}
