'use strict';

var ApiKey = '297eb650de708ced82cbf882b09ac7ff';
var body = document.getElementById('body');
var actualCity = document.querySelector('.actual-weather-city');
var actualWeather = document.querySelector('.actual-weather-weather');
var temperature = document.querySelector('.temperature');
var tempMax = document.querySelector('.temp-max');
var tempMin = document.querySelector('.temp-min');
var ulWeek = document.querySelector('#week');
var ulIcon = document.querySelector('#icons');
var ulMax = document.querySelector('#max');
var ulMin = document.querySelector('#min');
var hourView = document.querySelector('.hour-view');
var today = new Date();
var time = today.getHours(); // console.log(time)

function localisation(position) {
  var pos = position.coords;
  var latitude = pos.latitude;
  var longitude = pos.longitude; // console.log(pos)

  var urlAPI = "https://api.openweathermap.org/data/2.5/weather?lat=".concat(latitude, "&lon=").concat(longitude, "&&appid=").concat(ApiKey, "&units=metric&lang=fr");
  var urlAPI2 = "https://api.openweathermap.org/data/2.5/onecall?lat=".concat(latitude, "&lon=").concat(longitude, "&&appid=").concat(ApiKey, "&units=metric&lang=fr");
  fetch(urlAPI).then(function (response) {
    response.json().then(function (meteo) {
      // console.log(meteo)
      actualCity.textContent = meteo.name;
      var weather = meteo.weather[0];
      actualWeather.textContent = weather.description;
      var main = meteo.main;
      temperature.textContent = Math.round(main.temp);
      tempMax.textContent = Math.round(main.temp_max);
      tempMin.textContent = Math.round(main.temp_min);
    });
  });
  fetch(urlAPI2).then(function (response) {
    response.json().then(function (meteoDaily) {
      // console.log(meteoDaily) 
      var week = meteoDaily.daily;
      var hours = meteoDaily.hourly;
      var current = meteoDaily.current;
      var currentSunset = new Date(current.sunset * 1000).getHours();
      var currentSunrise = new Date(current.sunrise * 1000).getHours();

      if (time > currentSunset || time < currentSunrise) {
        body.classList.add('night');
      } else {
        if (current.main !== 'Clear') {
          body.classList.add('clouds');
        } else {
          body.classList.add('day');
        }
      }

      for (var i = 0; i < hours.length; i++) {
        // console.log(hours[i])
        var hour = new Date(hours[i].dt * 1000).getHours(); // console.log(hour)

        var weatherDay = hours[i].weather;
        var iconDay = weatherDay[0].icon;
        var ulHour = document.createElement('ul');
        var liHour = document.createElement('li');
        liHour.innerHTML = "".concat(hour, " h"); // console.log(iconDay)

        var liIcon = document.createElement('li');
        liIcon.innerHTML = "<img style=\"height: 30px;\" src=\"http://openweathermap.org/img/wn/".concat(iconDay, "@2x.png\">");
        var pTemp = document.createElement('p');
        pTemp.innerHTML = "".concat(Math.round(hours[i].temp), "\xB0");
        hourView.append(ulHour);
        ulHour.append(liHour, liIcon, pTemp);
      } // console.log(week)


      for (var _i = 1; _i < week.length - 1; _i++) {
        // console.log(week[i])
        var date = new Date(week[_i].dt * 1000).toLocaleString('fr-fr', {
          weekday: 'long'
        });
        var liWeek = document.createElement('li');
        liWeek.innerHTML = "".concat(date);
        ulWeek.append(liWeek);
        var weatherWeek = week[_i].weather;
        var _iconDay = weatherWeek[0].icon;

        if (week[_i].rain) {
          var rain = week[_i].rain * 100 + ' %'; // console.log(iconDay)

          var _liIcon = document.createElement('li');

          _liIcon.innerHTML = "<img style=\"height: 30px;\" src=\"http://openweathermap.org/img/wn/".concat(_iconDay, "@2x.png\"> ").concat(rain); // console.log(liIcon)

          ulIcon.append(_liIcon);
        } else {
          // console.log(iconDay)
          var _liIcon2 = document.createElement('li');

          _liIcon2.innerHTML = "<img style=\"height: 30px;\" src=\"http://openweathermap.org/img/wn/".concat(_iconDay, "@2x.png\">"); // console.log(liIcon)

          ulIcon.append(_liIcon2);
        }

        var tempWeek = week[_i].temp;
        var dayMax = Math.trunc(tempWeek.max);
        var dayMin = Math.trunc(tempWeek.min);
        var liMax = document.createElement('li');
        liMax.innerHTML = "".concat(dayMax);
        ulMax.append(liMax);
        var liMin = document.createElement('li');
        liMin.innerHTML = "".concat(dayMin);
        ulMin.append(liMin);
      }
    });
  });
}

navigator.geolocation.getCurrentPosition(localisation);