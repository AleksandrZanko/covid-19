export default { 
    async getData(param) {
        try {
            let response = await fetch('https://disease.sh/v3/covid-19/countries');
            const data = await response.json();

            const objActive = data.reduce((acc, curr, i) => {
                i = (param === "active") ? curr.active : (param === "recover") ? curr.recovered :
                    (param === "deaths") ? curr.deaths : curr.recovered + curr.active;
                acc[i] = curr.countryInfo[Object.keys(curr.countryInfo).find(key => key === 'iso2')]; 
                return acc;
            }, {});
            
            return objActive;

        } catch (error) {
            console.log(error);
        } 
    },
    async getInfoLabels() {
        try {
            let response = await fetch('https://disease.sh/v3/covid-19/all');
            const data = await response.json();
            const {active, recovered, deaths} = data;
 
            document.getElementById("act").textContent = `: ${active}`;
            document.getElementById("conf").textContent = `: ${recovered + active}`;
            document.getElementById("rec").textContent = `: ${recovered}`;
            document.getElementById("dead").textContent = `: ${deaths}`;
        } catch (error) {
            console.log(error);
        } 
    }
};