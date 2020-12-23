export default async function getDate(country) {
  let _allDates = []; 

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