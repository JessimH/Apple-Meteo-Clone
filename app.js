'use strict'
const ApiKey = '297eb650de708ced82cbf882b09ac7ff'
const body = document.getElementById('body')
const actualCity = document.querySelector('.actual-weather-city')
const actualWeather = document.querySelector('.actual-weather-weather')
const temperature = document.querySelector('.temperature')
const tempMax = document.querySelector('.temp-max')
const tempMin = document.querySelector('.temp-min')
const ulWeek = document.querySelector('#week')
const ulIcon = document.querySelector('#icons')
const ulMax = document.querySelector('#max')
const ulMin = document.querySelector('#min')
const hourView = document.querySelector('.hour-view')
var today = new Date()
var time = today.getHours()
// console.log(time)


function localisation(position){

    let pos = position.coords
    let latitude = pos.latitude
    let longitude = pos.longitude
    // console.log(pos)
    
    let urlAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&&appid=${ApiKey}&units=metric&lang=fr`
    let urlAPI2 = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&&appid=${ApiKey}&units=metric&lang=fr`
    fetch(urlAPI).then((response)=>{
        response.json().then((meteo)=> {
            // console.log(meteo)
            actualCity.textContent = meteo.name;
            const weather = meteo.weather[0]
            actualWeather.textContent = weather.description
            const main = meteo.main
            temperature.textContent = Math.round(main.temp)
            tempMax.textContent = Math.round(main.temp_max)
            tempMin.textContent = Math.round(main.temp_min)
            
        });
    })

    fetch(urlAPI2).then((response)=>{
        response.json().then((meteoDaily)=> {
            // console.log(meteoDaily) 
            const week = meteoDaily.daily
            const hours = meteoDaily.hourly
            const current = meteoDaily.current
            let currentSunset = new Date(current.sunset * 1000).getHours()
            let currentSunrise = new Date(current.sunrise * 1000).getHours()
    
            if(time > currentSunset || time < currentSunrise){
                body.classList.add('night')
            }else{
                if(current.main !== 'Clear'){
                    body.classList.add('clouds')
                }else{
                    body.classList.add('day')
                }
            }
            
            for(let i = 0; i < hours.length ; i++){
                // console.log(hours[i])
                let hour = new Date(hours[i].dt * 1000).getHours()
                // console.log(hour)
                const weatherDay = hours[i].weather
                const iconDay = weatherDay[0].icon
                let ulHour = document.createElement('ul')
                let liHour = document.createElement('li')
                liHour.innerHTML = `${hour} h`
                // console.log(iconDay)
                let liIcon = document.createElement('li')
                liIcon.innerHTML = `<img style="height: 30px;" src="http://openweathermap.org/img/wn/${iconDay}@2x.png">`
                
                let pTemp = document.createElement('p')
                pTemp.innerHTML = `${Math.round(hours[i].temp)}°`
                hourView.append(ulHour)
                ulHour.append(liHour, liIcon, pTemp)
            }
            // console.log(week)
            for(let i = 1; i < week.length - 1  ; i++){
                // console.log(week[i])

                let date = new Date(week[i].dt * 1000).toLocaleString('fr-fr', {  weekday: 'long' })
                let liWeek = document.createElement('li')
                liWeek.innerHTML = `${date}`
                ulWeek.append(liWeek)

                const weatherWeek = week[i].weather
                const iconDay = weatherWeek[0].icon
                if(week[i].rain){
                    const rain = week[i].rain * 100 + ' %'
                    // console.log(iconDay)
                    let liIcon = document.createElement('li')
                    liIcon.innerHTML = `<img style="height: 30px;" src="https://openweathermap.org/img/wn/${iconDay}@2x.png"> ${rain}`
                    // console.log(liIcon)
                    ulIcon.append(liIcon)
                }else{
                    // console.log(iconDay)
                    let liIcon = document.createElement('li')
                    liIcon.innerHTML = `<img style="height: 30px;" src="https://openweathermap.org/img/wn/${iconDay}@2x.png">`
                    // console.log(liIcon)
                    ulIcon.append(liIcon)
                }

                const tempWeek = week[i].temp
                const dayMax = Math.trunc(tempWeek.max);
                const dayMin = Math.trunc(tempWeek.min)
                let liMax = document.createElement('li')
                liMax.innerHTML = `${dayMax}°`
                ulMax.append(liMax)

                let liMin = document.createElement('li')
                liMin.innerHTML = `${dayMin}°`
                ulMin.append(liMin)
            }
        });
    })



}

navigator.geolocation.getCurrentPosition(localisation)