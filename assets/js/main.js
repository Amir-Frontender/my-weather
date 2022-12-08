import tabs from "./tabs.js";
import {setDate, getHoursAndMinutes} from "./editDate.js"
import {determineWeather, duration} from "./determineWeather.js"
import {weatherArr,dailyArr, createRowHours,createRowMainWeather,createRowForecast,createRowTemp,createRowTempDaily,createRowFeelsLike,createRowFeelsLikeDaily,createRowWind,createRowWindDaily} from "./hourlyWeather.js"

const API_KEY = '7d58141f53c96ca907663ccdbfa242d8';


    

async function geolocation(city) { //Определяет широту, долготу вводимого города
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`)
    const data = await response.json()
    return await data[0]
}

async function getCurrentLocation() { // Определяет текущую геопозицию
    return new Promise(resolve => {
        navigator.geolocation.getCurrentPosition(location => {
            resolve(location.coords);
        });
    });
}

async function fetchDataMain(city) { // Функция обращается к данным прогноза погоды по интересующемуся городу через широту  и долготу
    if(city){ // Если город введен
        try{
            const { lat, lon } = await geolocation(city) // Через данную функция получаем широту и долготу интересующегося города
            const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=metric&appid=${API_KEY}`)
            const data = await response.json()
            return await data
        }catch(e){ // В случае введения несуществующего города, выведет на экран блок с оштбкой 404 и текстом о неправильном введении названия города
            errorBlock.hidden = false
            hourlyEl.style.backgroundColor = 'inherit'
            currentEl.style.backgroundColor = 'inherit'
            forecastHourlyEl.style.backgroundColor = 'inherit'
            errorText.textContent = `Couldn't find the "${search.value}" in map`

            console.log(e)
        }
    }else{ //В противном случает выводит данные по текущей геопозиции
        const { latitude: lat, longitude: lon } = await getCurrentLocation()
        const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=metric&appid=${API_KEY}`)
        const data = await response.json()
        return await data
    }
}
async function fetchDataFiveDays(city) { //Аналогичная функция как fetchDataMain только обращается к другим данным прогноза погоды
    if(city){
        const { lat, lon, name } = await geolocation(city)
        const response = await fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
        const data = await response.json()
        return await data
    }else{
        const { latitude: lat, longitude: lon } = await getCurrentLocation()
        const response = await fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`)
        const data = await response.json()
        return await data
    }
}





const errorBlock = document.querySelector('.error')
const errorText = document.querySelector('.error__text')
const currentEl = document.querySelector('.current-weather__main')
const hourlyEl = document.querySelector('.current-weather__hourly')
const forecastEl = document.querySelector('.forecast__days')
const forecastHourlyEl = document.querySelector('.forecast__hourly')
const form = document.forms.form
const search = form.search



async function currentWeather(city) { //Общая функция выводящая текущую погоду
    errorBlock.hidden = true
    errorText.textContent = ''
    currentEl.style.backgroundColor = "#dfdfdf"
    hourlyEl.style.backgroundColor = "#dfdfdf"
    forecastHourlyEl.style.backgroundColor = "#dfdfdf"
    try{
        const { current, timezone_offset } = await fetchDataMain(city)
        const { weather, temp, feels_like, sunrise, sunset, dt } = current
        const heading = document.createElement('div') //Заглавление
        heading.className = 'current-weather__main-heading'
        const title = document.createElement('div')
        title.textContent = 'CURRENT WEATHER'
        const date = document.createElement('div')
        date.textContent = setDate(dt)
        heading.append(title, date)
    
        const body = document.createElement('div')//Общий блок
        body.className = 'current-weather__main-body'
    
        const weatherState = document.createElement('div')
        weatherState.className = 'current-weather__main-body-descr'
        const weatherIcon = document.createElement('div')
        weatherIcon.className = 'big-icon'
        const weatherText = document.createElement('p')
        const mainWeather = weather[0].main
        determineWeather(weatherIcon, mainWeather, sunrise, sunset, dt)
        weatherText.textContent = mainWeather
        weatherState.append(weatherIcon, weatherText)
    
        const temperature = document.createElement('div')
        temperature.className = 'current-weather__main-body-descr'
        const tempMain = document.createElement('div')
        tempMain.className = 'main-temp'
        const tempFeels = document.createElement('div')
        tempFeels.className = 'feels-temp'
        tempMain.textContent = Math.round(temp) + "\u2103"
        tempFeels.textContent = "Real feel " + Math.round(feels_like) + "\u2103"
        temperature.append(tempMain, tempFeels)
    
        const time = document.createElement('div')
        time.className = 'current-weather__main-body-descr'
        let offsetTime = new Date().getTimezoneOffset()*60
        const timeSunrise = document.createElement('p')
        timeSunrise.textContent = "Sunrise: " + getHoursAndMinutes(new Date((sunrise- (-offsetTime-timezone_offset)) * 1000).toLocaleTimeString('en-US'))
        const timeSunset = document.createElement('p')
        timeSunset.textContent = "Sunset: " + getHoursAndMinutes(new Date((sunset- (-offsetTime-timezone_offset)) * 1000).toLocaleTimeString('en-US'))
        const timeDuration = document.createElement('p')
        timeDuration.textContent = duration(sunrise, sunset)
        time.append(timeSunrise, timeSunset, timeDuration)
        body.append(weatherState, temperature, time)
        currentEl.append(heading, body)
    }catch(e){
        console.log(e);
    }

}
// // // // // // // // /// // // // // // // // //
async function hourlyWeather(elem, city) { // Функция создает таблицу с данными о ежечасовой погоде
    try{
        const { current, hourly } = await fetchDataMain(city)
        const { sunrise, sunset, dt } = current
        let sixHoursWeather = weatherArr(hourly, dt)
        const table = document.createElement('table')
        if(!elem.children.length){
            elem.append(table)
            createRowHours("TODAY", sixHoursWeather, table)
            createRowMainWeather(sixHoursWeather, table, sunrise, sunset, dt)
            createRowForecast('Forecast', sixHoursWeather, table)
            createRowTemp("Temp(\u2103)", sixHoursWeather, table)
            createRowFeelsLike("Real feel", sixHoursWeather, table)
            createRowWind('Wind (km/h)', sixHoursWeather, table)
        }
    }catch(e){
        console.log(e);
    }
}
// // // // // // // // // // // // // // // // // //
async function hourlyWeatherDays(targetDay, city) { // Функция создает таблицу с данными о погоде с разбивкой по 3 часа
    forecastHourlyEl.innerHTML = ''
    let { list } = await fetchDataFiveDays(city)
    let targetArray = dailyArr(list, targetDay)
    let timeDay = new Date(targetDay * 1000)
    let optionsDay = { weekday: 'long' }
    const table = document.createElement('table')
    if(!forecastHourlyEl.textContent){
        forecastHourlyEl.append(table)
        createRowHours((new Intl.DateTimeFormat('en-US', optionsDay).format(timeDay)), targetArray, table)
        createRowMainWeather(targetArray, table)
        createRowForecast('Forecast', targetArray, table)
        createRowTempDaily("Temp(\u2103)", targetArray, table)
        createRowFeelsLikeDaily("Real feel", targetArray, table)
        createRowWindDaily('Wind (km/h)', targetArray, table)
    }
}
// // // // // // // // // // // // // // // // // //
async function fiveDayForecast(city) { // Функция создает карточки с погодой по каждому дню и также вызывает функцию hourlyWeatherDays по выбранному дню из карточки
    try{

        const { daily } = await fetchDataMain(city)
        let arrCut = []
        let dateArr = []
        for (let elem of daily) {
            const { dt, temp: { day = temp }, weather: [{ main, description }], sunrise, sunset } = elem
            arrCut.push({ dt, day, main, description, sunrise, sunset })
            dateArr.push(dt)
        }
        arrCut.length = 5
        dateArr.length = 5
    
        arrCut.forEach((elem, index) => {
            let timeDay = new Date(elem.dt * 1000)
            let optionsDay = { weekday: 'short' }
            let optionsDate = { month: 'long', day: "numeric" }
            const card = document.createElement('div')
            card.className = 'forecast__days-card'
            const day = document.createElement('div')
            day.className = 'forecast__days-card-header'
            if (index === 0) {
                if (elem.dt > elem.sunset) {
                    day.textContent = "TONIGHT"
                } else day.textContent = "TODAY"
            } else {
                day.textContent = (new Intl.DateTimeFormat('en-US', optionsDay).format(timeDay)).toUpperCase()
            }
            const date = document.createElement('div')
            date.className = 'forecast__days-card-date'
            date.textContent = (new Intl.DateTimeFormat('en-US', optionsDate).format(timeDay)).toUpperCase()
            const mainEl = document.createElement('div')
            mainEl.className = 'forecast__days-card-main'
            mainEl.append(determineWeather(mainEl, elem.main, elem.sunrise, elem.sunset, elem.dt))
            const temp = document.createElement('div')
            temp.className = 'forecast__days-card-temp'
            temp.textContent = Math.round(elem.day) + "\u2103"
            const descr = document.createElement('div')
            descr.className = 'forecast__days-card-descr'
            descr.textContent = elem.description
    
            card.append(day, date, mainEl, temp, descr)
            forecastEl.append(card)
        })
        const cardsNodeList = document.querySelectorAll('.forecast__days-card')
    
        forecastEl.addEventListener('click', e => {
            cardsNodeList.forEach((elem,index) => {
                if (e.target.closest('.forecast__days-card') === elem) {
                    forecastHourlyEl.innerHTML = ''
                    if(index===0) { // Если кликнули на первую карточку то дублирует данные из превого раздела
                        hourlyWeather(forecastHourlyEl, search.value)
                    }else{
                        hourlyWeatherDays(dateArr[index], search.value)
                    }
                }
            })
        })
    }catch(e){
        console.log(e);
    }

}

tabs('#tabs', '.tabs__header-btn', '.tabs__content-item', '.active'); 
currentWeather()
hourlyWeather(hourlyEl)
fiveDayForecast()

form.addEventListener('submit',e=>{ // Событие позволяющая запускать основные функции для показа интересующей погоды города
    e.preventDefault()
    currentEl.textContent = ''
    hourlyEl.textContent = ''
    forecastEl.textContent = ''
    forecastHourlyEl.textContent = ''
    currentWeather(search.value)
    hourlyWeather(hourlyEl,search.value)
    fiveDayForecast(search.value)
})
