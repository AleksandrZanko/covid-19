export async function getApi(country) {
  let _allApi = [];
  let statusArr = ['confirmed', 'recovered', 'deaths'];
  if(country === 'world') {
    
    let responceWorld = await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=366');
    let contentWorld = await responceWorld.json();

    let population = 75940;
    let count = 0;
    Object.keys(contentWorld).forEach((status, index) => {
      
      _allApi[count] = {
        cases: []
      };
      _allApi[count].cases = Object.values(contentWorld[status]);
      _allApi[count].country = 'world';
      _allApi[count].status = status;
      _allApi[count].title = 'for all time';

      let _worldPlus = [];
      let _worldPlusOnDay100k = [];

      for(let i = 0; i < Object.values(contentWorld[status]).length - 1; i++) {     
        let next = Object.values(contentWorld[status])[i + 1];
        let current = Object.values(contentWorld[status])[i];
        _worldPlus.push(next - current);
        _worldPlusOnDay100k.push((next - current) / population);
      }

      _allApi[count + 1] = {
        cases: []
      };
      _allApi[count + 1].cases = _worldPlus;
      _allApi[count + 1].country = 'world';
      _allApi[count + 1].status = status;
      _allApi[count + 1].title = 'per day';

      _allApi[count + 2] = {
        cases: []
      };
      _allApi[count + 2].cases = _worldPlusOnDay100k;
      _allApi[count + 2].country = 'world';
      _allApi[count + 2].status = status;
      _allApi[count + 2].title = 'per day to 100K';

      _allApi[count + 3] = {
        cases: []
      };

      let worldPopulation = Object.values(contentWorld[status]).map(day => day / population);
      _allApi[count + 3].cases = worldPopulation;
      _allApi[count + 3].country = 'world';
      _allApi[count + 3].status = status;
      _allApi[count + 3].title = 'for all time to 100K';
      count = count + 4;
    })
  
    return _allApi;
  } else {
    let allUrl = statusArr.map((item) => `https://api.covid19api.com/dayone/country/${country.toLowerCase()}/status/${item}`);
    let allResponce = allUrl.map((url) => fetch(url));

    let responceCountry = await fetch('https://restcountries.eu/rest/v2/all?fields=name;population;flag');
    let contentCountryes = await responceCountry.json();
    let population;

    for(let i = 0; i < contentCountryes.length; i++) {   
      if(contentCountryes[i].name == country) {     
        population = (contentCountryes[i].population);
      }
    }
    population = Math.round(population / 100000);

    return Promise.all(allResponce).then((responces) => {
      return Promise.all(responces.map((responce) => {
        return responce.json()
      }))
    }).then((datas) => {
      let count = 0;
      datas.map((data) => {
        _allApi[count] = {
          cases: []
        };

        let cases = data.map(day => day.Cases)
        _allApi[count].cases = cases;
        _allApi[count].country = data[0].Country;
        _allApi[count].status = data[0].Status;
        _allApi[count].title = 'for all time';
        let _currentPlus = [];
        let _currentPlusOnDay100k = [];

        for(let i = 0; i < data.length - 1; i++) {
          let next = data[i + 1].Cases;
          let current = data[i].Cases;
          _currentPlus.push(next - current);
          _currentPlusOnDay100k.push((next - current) / population);
        }
        _allApi[count + 1] = {
          cases: []
        };
        _allApi[count + 1].cases = _currentPlus;
        _allApi[count + 1].country = data[0].Country;
        _allApi[count + 1].status = data[0].Status;
        _allApi[count + 1].title = 'per day';

        _allApi[count + 2] = {
          cases: []
        };
        _allApi[count + 2].cases = _currentPlusOnDay100k;
        _allApi[count + 2].country = data[0].Country;
        _allApi[count + 2].status = data[0].Status;
        _allApi[count + 2].title = 'per day to 100K';

        _allApi[count + 3] = {
          cases: []
        };
        let casesPopulation = data.map(day => day.Cases / population);
        _allApi[count + 3].cases = casesPopulation;
        _allApi[count + 3].country = data[0].Country;
        _allApi[count + 3].status = data[0].Status;
        _allApi[count + 3].title = 'for all time to 100K';
        count = count + 4;
      }) 
      
      return _allApi;
    })
  }
}

export async function getDate(country) {
  let _allDates = []; 
  if(country === 'world') {
    let responceWorld = await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=366');
    let contentWorld = await responceWorld.json();

    _allDates = Object.keys(contentWorld.cases);
    return _allDates;
  } else {

    let statusArr = ['confirmed', 'recovered', 'deaths'];

    let allUrl = statusArr.map((item) => `https://api.covid19api.com/dayone/country/${country.toLowerCase()}/status/${item}`);
    let allResponce = allUrl.map((url) => fetch(url));


    return Promise.all(allResponce).then((responces) => {
      return Promise.all(responces.map((responce) => {
        return responce.json()
      }))
    }).then((datas) => {
      datas.map((data) => {
        _allDates.push(data.map(day => day.Date.slice(0,10)));
      })
      _allDates = _allDates[0];

      return _allDates;
    })
  }
}


  