import '../css/style.css';
import '../css/style.scss';
import createChart from './chart.js';
import { getApi, getDate } from './api.js';
import renderCharts from './render-chart.js';
import '../css/leaflet.css';
import L from 'leaflet';
import jsonland from "./map-leaflet/jsonland.js";
import Map from './map_data.js';
import * as keyboard from './keyboard.js';

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


const searchInput = document.getElementById('search'),
    results = document.querySelector('.results'),
    container = document.querySelector('.container'),
    bottomBlock = document.querySelector('.bottom-block'),
    rightBlock = document.querySelector('.right-block');

let isKeyboardShown;
document.querySelector(".keyboardButton").addEventListener("click", () => {
    searchInput.focus();
    isKeyboardShown = keyboard.Keyboard.properties.shown || false;
    if (isKeyboardShown) {
        document.querySelector(".keyboard").remove();
        keyboard.Keyboard._setDefault();
        return;
    }
    keyboard.Keyboard.properties.shown = true;
    keyboard.startListeners(searchInput);
    searchInput.dispatchEvent(new Event('focus'));
});


let searchTerm = '',
    countries;

const fetchCountries = async () => {
    //countries = await fetch('https://restcountries.eu/rest/v2/all?fields=name;population;flag').then(res => res.json());
    countries = await fetch('https://disease.sh/v3/covid-19/countries').then(res => res.json());
}



let totalCases = document.createElement("div");
let totalDeath = document.createElement("div");
let totalRecovered = document.createElement("div");

let total = document.querySelector(".tables-wrapper");
totalCases.classList.add('total');
totalDeath.classList.add('total');
totalRecovered.classList.add('total');

total.appendChild(totalCases);
total.appendChild(totalDeath);
total.appendChild(totalRecovered);

//bottomBlock.appendChild(total);

//totalTitle.innerHTML = 'Total Cases';

function getTotalCases() {
    return countries.reduce((a, b) => a + b.cases, 0).toLocaleString();
}
function getTotalDeaths() {
    return countries.reduce((a, b) => a + b.deaths, 0).toLocaleString();
}
function getTotalRecovered() {
    return countries.reduce((a, b) => a + b.recovered, 0).toLocaleString();
}

const showCountries = async () => {
    let table = document.createElement('table');
    results.innerHTML = '';

    //getting the data
    await fetchCountries();

    table.classList.add('countries', "table");
    let header = document.createElement("tr");

    let nameHeaderCell = document.createElement("th");
    let casesHeaderCell = document.createElement("th");
    let thead = document.createElement("thead");

    nameHeaderCell.classList.add('country-item', 'country-item__name', "country-item__header");
    casesHeaderCell.classList.add('country-item', 'country-item__population', 'country-item__header');

    nameHeaderCell.innerHTML = "Country &#8597";
    casesHeaderCell.innerHTML = "Cases &#8597";

    header.appendChild(nameHeaderCell);
    header.appendChild(casesHeaderCell);

    thead.appendChild(header);
    table.appendChild(thead);

    //function createTable() {
    //countries.filter(country => country.name.toLowerCase().includes(searchTerm.toLowerCase()));
    let tbody = document.createElement("tbody");
    for (let country of countries) {

        let tr = document.createElement("tr");

        let flagCell = document.createElement("img");
        let nameCell = document.createElement("td");
        let casesCell = document.createElement("td");
        flagCell.src = country.countryInfo.flag;

        nameCell.appendChild(flagCell);
        nameCell.appendChild(document.createTextNode(country.country));
        casesCell.appendChild(document.createTextNode(country.cases));

        tr.classList.add('country-item__tr');
        flagCell.classList.add('country-item__flag');
        nameCell.classList.add('country-item', 'country-item__name');
        casesCell.classList.add('country-item', 'country-item__population');

        tr.appendChild(nameCell);
        tr.appendChild(casesCell);
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    results.appendChild(table);
    totalCases.innerHTML = `Total cases: ${getTotalCases()}`;
    totalDeath.innerHTML = `Total deaths:  ${getTotalDeaths()}`;
    totalRecovered.innerHTML = `Total recovered:  ${getTotalRecovered()}`;
    tableSort();
}

showCountries();

function getPer100Cases(casesDeaths, population) {
    if (population === 0) {
        return 0;
    }
    return Math.round(casesDeaths * 100000 / population);
}

const showCountries2 = async () => {
    let table2 = document.createElement('table');
    table2.classList.add("table_sort");
    results.innerHTML = '';

    //getting the data
    await fetchCountries();

    table2.classList.add('countries');
    let header = document.createElement("tr");
    let thead = document.createElement("thead");

    let nameHeaderCell = document.createElement("th");
    let casesHeaderCell = document.createElement("th");
    let populationHeaderCell = document.createElement("th");
    let deathHeaderCell = document.createElement("th");
    let recoveredHeaderCell = document.createElement("th");
    let casesIn100HeaderCell = document.createElement("th");
    let deathIn100HeaderCell = document.createElement("th");
    let recovered100HeaderCell = document.createElement("th");
    let todayCasesHeaderCell = document.createElement("th");
    let todayDeathHeaderCell = document.createElement("th");
    let todayRecoveredHeaderCell = document.createElement("th");

    thead.classList.add("thead");
    nameHeaderCell.classList.add('country-item', 'country-item__name', "country-item__header");
    casesHeaderCell.classList.add('country-item', 'country-item__population', 'country-item__header');
    populationHeaderCell.classList.add('country-item', 'country-item__population', 'country-item__header');
    deathHeaderCell.classList.add('country-item', 'country-item__population', 'country-item__header');
    recoveredHeaderCell.classList.add('country-item', 'country-item__population', 'country-item__header');
    casesIn100HeaderCell.classList.add('country-item', 'country-item__population', 'country-item__header');
    deathIn100HeaderCell.classList.add('country-item', 'country-item__population', 'country-item__header');
    recovered100HeaderCell.classList.add('country-item', 'country-item__population', 'country-item__header');
    todayCasesHeaderCell.classList.add('country-item', 'country-item__population', 'country-item__header');
    todayDeathHeaderCell.classList.add('country-item', 'country-item__population', 'country-item__header');
    todayRecoveredHeaderCell.classList.add('country-item', 'country-item__population', 'country-item__header');

    nameHeaderCell.innerHTML = "Country 	&#8597";
    casesHeaderCell.innerHTML = "Cases &#8597";
    populationHeaderCell.innerHTML = "Population &#8597";
    deathHeaderCell.innerHTML = "Deaths &#8597";
    recoveredHeaderCell.innerHTML = "Recovered &#8597";
    casesIn100HeaderCell.innerHTML = "Cases per 100 000 &#8597";
    deathIn100HeaderCell.innerHTML = "Deaths per 100 000 &#8597";
    recovered100HeaderCell.innerHTML = "Recovered per 100 000 &#8597";
    todayCasesHeaderCell.innerHTML = "Today cases &#8597";
    todayDeathHeaderCell.innerHTML = "Today deaths &#8597";
    todayRecoveredHeaderCell.innerHTML = "Today recovered &#8597";

    header.appendChild(nameHeaderCell);
    header.appendChild(casesHeaderCell);
    header.appendChild(populationHeaderCell);
    header.appendChild(deathHeaderCell);
    header.appendChild(recoveredHeaderCell);
    header.appendChild(casesIn100HeaderCell);
    header.appendChild(deathIn100HeaderCell);
    header.appendChild(recovered100HeaderCell);
    header.appendChild(todayCasesHeaderCell);
    header.appendChild(todayDeathHeaderCell);
    header.appendChild(todayRecoveredHeaderCell);

    thead.appendChild(header);
    table2.appendChild(thead);
    //function createTable() {
    //countries.filter(country => country.name.toLowerCase().includes(searchTerm.toLowerCase()));
    let tbody = document.createElement("tbody")
    for (let country of countries) {

        let tr = document.createElement("tr");

        let flagCell = document.createElement("img");
        let nameCell = document.createElement("td");
        let casesCell = document.createElement("td");
        flagCell.src = country.countryInfo.flag;
        let populationCell = document.createElement("td");
        let deathCell = document.createElement("td");
        let recoveredCell = document.createElement("td");
        let casesIn100Cell = document.createElement("td");
        let deathIn100Cell = document.createElement("td");
        let recovered100Cell = document.createElement("td");
        let todayCasesCell = document.createElement("td");
        let todayDeathCell = document.createElement("td");
        let todayRecoveredCell = document.createElement("td");

        nameCell.appendChild(flagCell);
        nameCell.appendChild(document.createTextNode(country.country));
        casesCell.appendChild(document.createTextNode(country.cases));
        populationCell.appendChild(document.createTextNode(country.population));
        deathCell.appendChild(document.createTextNode(country.deaths));
        recoveredCell.appendChild(document.createTextNode(country.recovered));
        let casesIn100 = getPer100Cases(country.cases, country.population);
        casesIn100Cell.appendChild(document.createTextNode(casesIn100));
        let deathIn100 = getPer100Cases(country.deaths, country.population);
        deathIn100Cell.appendChild(document.createTextNode(deathIn100));
        let recoveredIn100 = getPer100Cases(country.recovered, country.population);
        recovered100Cell.appendChild(document.createTextNode(recoveredIn100));
        todayCasesCell.appendChild(document.createTextNode(country.todayCases));
        todayDeathCell.appendChild(document.createTextNode(country.todayDeaths));
        todayRecoveredCell.appendChild(document.createTextNode(country.todayRecovered));

        tr.classList.add('country-item__tr');
        flagCell.classList.add('country-item__flag');
        nameCell.classList.add('country-item', 'country-item__name');
        casesCell.classList.add('country-item', 'country-item__population');
        populationCell.classList.add('country-item', 'country-item__population');
        deathCell.classList.add('country-item', 'country-item__population');
        recoveredCell.classList.add('country-item', 'country-item__population');
        casesIn100Cell.classList.add('country-item', 'country-item__population');
        deathIn100Cell.classList.add('country-item', 'country-item__population');
        recovered100Cell.classList.add('country-item', 'country-item__population');
        todayCasesCell.classList.add('country-item', 'country-item__population');
        todayDeathCell.classList.add('country-item', 'country-item__population');
        todayRecoveredCell.classList.add('country-item', 'country-item__population');

        tr.appendChild(nameCell);
        tr.appendChild(casesCell);
        tr.appendChild(populationCell);
        tr.appendChild(deathCell);
        tr.appendChild(recoveredCell);
        tr.appendChild(casesIn100Cell);
        tr.appendChild(deathIn100Cell);
        tr.appendChild(recovered100Cell);
        tr.appendChild(todayCasesCell);
        tr.appendChild(todayDeathCell);
        tr.appendChild(todayRecoveredCell);

        tbody.appendChild(tr);
    }
    table2.appendChild(tbody);
    results.appendChild(table2);
    tableSort();
}

function removeTable() {
    let table = document.querySelector(".countries");
    table.remove();
}

let full = false;
let fullWindow = document.querySelector('.fullWindow');
let fullWindowButtom = document.querySelector('.fullWindowButtom');
let fullWindowEnd = document.querySelector('.fullWindowEnd');
let leftBlock = document.querySelector('.left-block');
fullWindowButtom.addEventListener("click", (e) => {
    searchInput.value = '';
    if (isKeyboardShown) {
        keyboard.Keyboard.properties.value = '';
        searchInput.focus();
    }
    filterCountry('');
    removeTable();
    if (full === false) {
        e.preventDefault();
        leftBlock.classList.add('fullScreen');
        fullWindow.classList.add("displayNone");
        fullWindowEnd.classList.toggle("displayNone");
        full = true;
        showCountries2();
    } else {
        leftBlock.classList.toggle("fullScreen");
        fullWindow.classList.toggle("displayNone");
        fullWindowEnd.classList.add("displayNone");
        full = false;

        showCountries();
    }
})

function toNumber(x) {
    return x.replace(/[^0-9.]/g, "");
}

function filterCountry(searchTerm) {
    searchTerm = searchTerm.toLowerCase();
    // Declare variables
    const tableBody = document.querySelector(".countries").children[1];
    let tr = tableBody.querySelectorAll("tr");
    let txtValue;
    let td;

    // Loop through all table rows, and hide those who don't match the search query
    for (let i = 0; i < tr.length; i++) {
        td = tr[i].querySelectorAll("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toLowerCase().indexOf(searchTerm) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}

searchInput.addEventListener("input", (e) => {
    searchTerm = e.target.value;
    filterCountry(searchTerm);
})

const tableSort = () => {
    let sortOrder = false;
    const getCellValue = (tr, index) =>
        tr.children[index].innerText || tr.children[index].textContent;

    const comparer = (index, asc) => (a, b) =>
        ((v1, v2) =>
            v1 !== "" && v2 !== "" && !isNaN(v1) && !isNaN(v2)
                ? v1 - v2
                : v1.toString().localeCompare(v2))(
                    getCellValue(asc ? a : b, index),
                    getCellValue(asc ? b : a, index)
                );

    document.querySelectorAll(".country-item__header").forEach((th) =>
        th.addEventListener("click", () => {
            const tableBody = th.closest("table").children[1];
            Array.from(tableBody.querySelectorAll("tr"))
                .sort(
                    comparer(
                        Array.from(th.parentNode.children).indexOf(th),
                        (sortOrder = !sortOrder)
                    )
                )
                .forEach((tr) => tableBody.appendChild(tr));
        })
    );
};