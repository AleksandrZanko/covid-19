import '../css/style.css';
import '../css/style.scss';
import createChart from './chart.js';
import {getApi, getDate} from './api.js';
import renderCharts from './render-chart.js';

import '../css/leaflet.css';
import L from 'leaflet';
import jsonland from "./map-leaflet/jsonland.js";
import Map from './map_data.js';


let chartSlider = document.querySelector('.chart-wrapper');
let country = 'world';

renderCharts('.charts', country);

/** Map */ 
try {
    Map.getInfoLabels();
    let _objActive = {};
    let geojson;
    let popup = L.popup();
    let idOfLabel;

    const months = {0:"January", 1:"February", 2:"March", 3:"April", 4:"May", 5:"June", 6:"July", 7:"August", 8:"September", 9:"October", 10:"November", 11:"December"};
    const date = document.querySelector(".date");
    let data = new Date(),
        month = data.getMonth(),
        year = data.getFullYear(),
        num = data.getDate();
    date.innerHTML = `${months[month]} ${num}, ${year}`;


    let loupe = L.control({position: 'topright'});

    let legend = L.control({position: 'topright'});
    let legendInfo = L.control({position: 'topright'});

    let labelActive = L.control({position: 'bottomright'});
    let labelConfirm = L.control({position: 'bottomright'});
    let labelRecover= L.control({position: 'bottomright'});
    let labelDeaths = L.control({position: 'bottomright'});
    
    const map = L.map('map', { center: [0, 0], zoom: 2});

/* Addition / Toggle buttons with general statistics Active / Confirmed / Recovered / Deaths */
labelActive.onAdd = (map) => {
const div = L.DomUtil.create('div', 'labelActive');
div.innerHTML = `<input type="radio" name="label" id ="active" value="active" checked><label for="active">Active <span id="act"></span></label>`;
return div;
};
labelConfirm.onAdd = (map) => {
const div = L.DomUtil.create('div', 'labelConfirm');
div.innerHTML = `<input type="radio" name="label" id ="confirmed" value="confirmed"><label for="confirmed">Confirmed <span id="conf"></span></label>`;
return div;
};
labelRecover.onAdd = (map) => {
const div = L.DomUtil.create('div', 'labelRecover');
div.innerHTML = `<input type="radio" name="label" id ="recover" value="recover"><label for="recover">Recovered <span id="rec"></span></label>`;
return div;
};
labelDeaths.onAdd = (map) => {
const div = L.DomUtil.create('div', 'labelDeaths');
div.innerHTML = `<input type="radio" name="label" id ="deaths" value="deaths"><label for="deaths">Deaths <span id="dead"></span></label>`;
return div;
};
labelActive.addTo(map);
labelConfirm.addTo(map);
labelRecover.addTo(map);
labelDeaths.addTo(map);

const btnLabels = document.querySelectorAll('input[name="label"]');
btnLabels.forEach(label => {
if (label.checked) idOfLabel = label.id;
label.addEventListener('click', (e) => {
    toggleBtnLabels(e.target.id);
})
});

const toggleBtnLabels = (id) => {
Map.getData(id).then((data) => {
    const _objTemp = JSON.stringify(data);
    _objActive = JSON.parse(_objTemp);
    updateGeoJson(jsonland);
});    
} 
/* *** */

const getColor = (d) => {
return d > 5000000 ? '#7a221b' :
       d > 1000000 ? '#992a22' :
       d > 500000 ? '#b73229' :
       d > 250000 ? '#d63b2f' :
       d > 100000 ? '#f44336' :
       d > 50000 ? '#f66257' :
       d > 20000 ? '#f88279' :
       d > 5000 ? '#faa19b' :
       d > 1000 ? '#fcc7c3' :
                '#feeceb';
};

loupe.onAdd = (map) => {
    return L.DomUtil.create('div', 'loupe')
};
loupe.addTo(map);

document.querySelector("#map > div.leaflet-control-container > div.leaflet-top.leaflet-right > div.loupe.leaflet-control").addEventListener('click' , () => {
    document.body.classList.toggle("fullScreen"); 
    document.querySelector("#map").style.position = document.body.className.indexOf("fullScreen") > -1 ? 'absolute' : 'relative';
    document.body.scrollTop = 0;
});

legendInfo.onAdd = (map) => {
return L.DomUtil.create('div', 'legendInfo')
};
legend.onAdd = (map) => {
const div = L.DomUtil.create('div', 'info legend'),
grades = [1, 1000, 5000, 20000, 50000, 100000, 250000, 500000, 1000000, 5000000];

for (let i = 0; i < grades.length; i++) {
    div.innerHTML += '<span><i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
     grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '</span>' : '+</span>');
}
return div;
};
legendInfo.addTo(map);
legend.addTo(map);

document.querySelector("#map > div.leaflet-control-container > div.leaflet-top.leaflet-right > div.legendInfo.leaflet-control").addEventListener('click' , () => {
document.querySelector("#map > div.leaflet-control-container > div.leaflet-top.leaflet-right > div.info.legend.leaflet-control").classList.toggle("openLegend") 
});

const style = (geoJsonFeature) => {
return {
    color: '#eaeeee',
    weight: 1,
    opacity: 1,
    fillColor: getColor(Object.keys(_objActive).find(key => _objActive[key] === geoJsonFeature.properties.id) === undefined ? 0 : Object.keys(_objActive).find(key => _objActive[key] === geoJsonFeature.properties.id)),
    fillOpacity: 1
}
};

const highlightCountry = (e) => {
const layer = e.target;
popup.setLatLng(layer.getBounds().getCenter())
.setContent(`${layer.feature.properties.name} : ${Object.keys(_objActive).find(key => _objActive[key] === layer.feature.properties.id) === undefined ? 0 : Object.keys(_objActive).find(key => _objActive[key] === layer.feature.properties.id)}`)
.openOn(map);

layer.setStyle({
    fillColor: '#fff',
    fillOpacity: 1
});

if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
}
}

const sendCountry = (e) => {
    const layer = e.target;

    renderCharts('.charts', layer.feature.properties.name);

    console.log(layer.feature.properties.name);
    
    let createdCharts = document.querySelectorAll('.created-chart');
    let sliderButton = document.querySelector('.chart-button');
    let chartSliderButtons = document.querySelector('.chart-slider-buttons');
    
    for(let i = 0; i < createdCharts.length; i++) {
        createdCharts[i].remove();
    }
    sliderButton.remove();
    chartSliderButtons.remove();
    renderCharts('.charts', layer.feature.properties.id);

}

const highlightClear = (e) => {
    popup.closePopup();
    geojson.resetStyle(e.target);
}
    
const onEachCountry = (feature, layer) => {
layer.on({
    mouseover: highlightCountry,
    mouseout: highlightClear,
    click: sendCountry
});
}

const updateGeoJson = (jsonland) => {
geojson = L.geoJson(jsonland, { 
style: style,
onEachFeature: onEachCountry
}).addTo(map);
return geojson;
}
updateGeoJson(jsonland); 

Map.getData(idOfLabel).then((data) => {
const _objTemp = JSON.stringify(data);
_objActive = JSON.parse(_objTemp);
updateGeoJson(jsonland); 
});

} catch (error) {
console.log(error);
}

