import createChart from './chart.js';
import {getApi, getDate} from './api.js';

export default async function renderCharts(slider, country) {
  let sliderWrapper = document.querySelector(slider);
  let datas = await getApi(country);
  let dates = await getDate(country);
  
  datas.forEach((data) => {
    let chart = createChart(data, dates);
    sliderWrapper.appendChild(chart);
  })

  let createdCharts = document.querySelectorAll('.created-chart');
  const chartWrapper = document.querySelector('.chart-wrapper');
  const chartButton = document.createElement('button');
  const chartOverlay = document.createElement('div');
  const body = document.querySelector('body');

  chartButton.classList.add('chart-button');
  chartWrapper.appendChild(chartButton);
  body.appendChild(chartOverlay);

  chartButton.addEventListener('click', function (e) {
  	e.preventDefault();
    chartOverlay.classList.toggle('chart-overlay--active');
  	chartWrapper.classList.toggle('chart--fullscrean');
  	chartButton.classList.toggle('chart-button--fullscrean');
  })


 // slider buttons
  const sliderButtonsWrapper = document.createElement('div');
  const chartLeftButton = document.createElement('button');
  const chartRightButton = document.createElement('button');
  
  sliderButtonsWrapper.classList.add('chart-slider-buttons');
  chartLeftButton.classList.add('chart-left');
  chartOverlay.classList.add('chart-overlay');
  chartLeftButton.textContent = '<';  
  chartRightButton.classList.add('chart-right');
  chartRightButton.textContent = '>';
  chartWrapper.appendChild(sliderButtonsWrapper);
  sliderButtonsWrapper.appendChild(chartLeftButton);
  sliderButtonsWrapper.appendChild(chartRightButton);  

  for(let item of createdCharts) {
  	item.style.display = 'none';
  }
  
  let slide = createdCharts[0];
  slide.style.display = 'block';

  chartRightButton.addEventListener('click', function(e) {
  	e.preventDefault();
  	if(slide === createdCharts[createdCharts.length - 1]) {
  		slide.style.display = 'none';
  		slide = createdCharts[0];
  		slide.style.display = 'block';
  	} else {
  		slide.style.display = 'none';     
  		slide = slide.nextElementSibling;
  		slide.style.display = 'block';   
  	}	
  })

  chartLeftButton.addEventListener('click', function(e) {
  	e.preventDefault();
  	if(slide === createdCharts[0]) {
  		slide.style.display = 'none';
  		slide = createdCharts[createdCharts.length - 1];
  		slide.style.display = 'block';
  	} else {
  		slide.style.display = 'none';
  		slide = slide.previousElementSibling;
  		slide.style.display = 'block';
  	}	
  })
}