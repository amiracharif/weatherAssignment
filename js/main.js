let apiKey ='1c231fc352514bf09eb143926242601'
let cardsContainer = document.querySelector('.forecast-cards')
let locationName = document.querySelector('.location .location')
let searchBox = document.querySelector('#searchBox')
let cityData = document.querySelector('.city-items')
let rainHoursElements = document.querySelectorAll("[data-clock]");


// console.log(searchBox)

async function getWeather(country){
    let response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${country}&days=3`)
   let result = await response.json()
   displayWeather(result);
    // console.log(result);
}

// getWeather('london')

// let date = new Date()

// console.log(date.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));

function displayWeather(result){
// console.log('result',result.forecast.forecastday);
let forcast = result.forecast.forecastday;
// let day = new Date()
locationName.innerHTML = result.location.name;
let cartona = ''
for(let i=0 ; i< forcast.length ; i++){
    let date = new Date(forcast[i].date)
    let weekday = date.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    // console.log(date.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    cartona += `
    <div class="card ${i==0? "active" : ""}" data-index="${i}" >
    <div class="card-header">
      <div class="day">${weekday}</div>
    </div>
    <div class="card-body">
    <img src="./images/conditions/${forcast[i].day.condition.text}.svg"/>
    <div class="degree">${forcast[i].hour[date.getHours()].temp_c}°C</div>
    </div>
    <div class="card-data">
      <ul class="left-column">
        <li>Real Feel: <span class="real-feel">${forcast[i].hour[date.getHours()].feelslike_c}°C</span></li>
        <li>Wind: <span class="wind">${forcast[i].hour[date.getHours()].wind_kph} K/h</span></li>
        <li>Pressure: <span class="pressure">${forcast[i].hour[date.getHours()].pressure_mb} Mb</span></li>
        <li>Humidity: <span class="humidity">${forcast[i].hour[date.getHours()].humidity} %</span></li>
      </ul>
      <ul class="right-column">
        <li>Sunrise: <span class="sunrise">  ${forcast[i].astro.sunrise} AM </span></li>
        <li>Sunset: <span class="sunset">${forcast[i].astro.sunset} PM</span></li>
      </ul>
    </div>
  </div>

    `

}
cardsContainer.innerHTML= cartona

let allCards= document.querySelectorAll('.card');

for( let i=0 ; i < allCards.length ; i++){
    allCards[i].addEventListener('click',function(e){
        // console.log(e.target);
        // console.log(e.currentTarget);
   
        let activeCard = document.querySelector('.card.active');
        activeCard.classList.remove('active')
        e.currentTarget.classList.add('active')
        displayRainInfo(forcast[e.currentTarget.dataset.index])

    })
}

displayImage(result.location.name,result.location.country)
}


navigator.geolocation.getCurrentPosition(sucess,error)

function sucess (position){
  // console.log(position);
  // console.log(position.coords.latitude);
  // console.log(position.coords.longitude);

  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let currentPosition = `${latitude},${longitude}`
  // console.log(currentPosition);

  getWeather(currentPosition)
}

function error(){
  getWeather('Hama')
}

searchBox.addEventListener('keyup',function(e){
  // console.log(searchBox.value)

  if(e.key == 'Enter'){
    // getWeather(searchBox.value)
    // console.log(searchBox.value);
    getWeather(searchBox.value)
  }
})

searchBox.addEventListener('blur',function(){
  getWeather(searchBox.value)
})


async function getImage(city){
  let response = await fetch(`https://api.unsplash.com/search/photos?page=1&query=${city}&client_id=maVgNo3IKVd7Pw7-_q4fywxtQCACntlNXKBBsFdrBzI&per_page=5&orientation=landscape`)
let result = await response.json();

let resultIndex =Math.floor(Math.random()*result.results.length);
let cityData=result.results[resultIndex];
console.log(cityData);
return cityData;
}

getImage('damascus')

async function displayImage(city, country){
  let cityInfo = await getImage('city') 

  let item = `<div class="item">
  <div class="city-image">
    <img src="${cityInfo.urls.regular}" alt="Image for ${city} city" />
  </div>
  <div class="city-name"><span class="city-name">${city}</span>, ${country}</div>
  </div>`
  
  cityData.innerHTML += item

}


function displayRainInfo(weather) {
  for (let element of rainHoursElements) {
    const clock = element.dataset.clock;
    let height = weather.hour[clock].chance_of_rain
    element.querySelector(".percent").style.height = `${height}%`
  }
}
