import '../css/style.css';
import '../css/style.scss';
import createChart from './chart.js';
import {getApi, getDate} from './api.js';
import renderCharts from './render-chart.js';

let chartSlider = document.querySelector('.chart-wrapper');
let country = 'world';

renderCharts('.charts', country);
