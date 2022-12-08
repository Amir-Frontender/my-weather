import  getHours from "./editDate.js"
import determineWeather from "./determineWeather.js"
export {weatherArr,dailyArr, createRowHours,createRowMainWeather,createRowForecast,createRowTemp,createRowTempDaily,createRowFeelsLike,createRowFeelsLikeDaily,createRowWind,createRowWindDaily}
function weatherArr(hourly, date) { //Функция принимает почасовые данные погоды и выводит массив только из 8 данных в зависимости от текущего времени
    let now = new Date(date * 1000)
    let weatherStat = []
    for (let i = 0; i <= 8; i++) {
        if (new Date(hourly[i].dt * 1000) > now) {
            weatherStat.push(hourly[i])
        }
    }
    return weatherStat
}
function dailyArr(array, day) { //Функция создает массив данных погоды интересующего нас дня
    let weatherStat = []
    for (let elem of array) {
        if (new Date(day * 1000).getDate() == new Date(elem.dt * 1000).getDate()) {
            weatherStat.push(elem);
        }
    }
    return weatherStat
}

function windRose(deg) { //Определяет направление ветра
    if (deg > 348.75 && deg <= 360) return "N"
    if (deg > 0 && deg <= 11.25) return "N"
    if (deg > 11.25 && deg <= 33.75) return "NNE"
    if (deg > 33.75 && deg <= 56.25) return "NE"
    if (deg > 56.25 && deg <= 78.75) return "ENE"
    if (deg > 78.75 && deg <= 101.25) return "E"
    if (deg > 101.25 && deg <= 123.75) return "ESE"
    if (deg > 123.75 && deg <= 146.25) return "SE"
    if (deg > 146.25 && deg <= 168.75) return "SE"
    if (deg > 168.75 && deg <= 191.25) return "S"
    if (deg > 191.25 && deg <= 213.75) return "SSW"
    if (deg > 213.75 && deg <= 236.25) return "SW"
    if (deg > 236.25 && deg <= 258.75) return "WSW"
    if (deg > 258.75 && deg <= 281.25) return "W"
    if (deg > 281.25 && deg <= 303.75) return "WNW"
    if (deg > 303.75 && deg <= 326.25) return "NW"
    if (deg > 326.25 && deg <= 348.75) return "NNW"
}

function createRowHours(heading, array, table) { // Часть таблицы. Функция создает строку времени 
    const tableRow = document.createElement('tr')
    const tableHead = document.createElement('th')
    tableHead.textContent = heading
    tableRow.append(tableHead)
    for (let elem of array) {
        const tableData = document.createElement('td')
        tableData.textContent = getHours(new Date(elem.dt * 1000).toLocaleTimeString('en-Us'))
        tableRow.append(tableData)
    }
    table.append(tableRow)
}
function createRowMainWeather(array, table, sunrise, sunset, dt) { // Функция создает строку из статуса погоды. Информация выводится ввиде иконки
    const tableRow = document.createElement('tr')
    const tableHead = document.createElement('th')
    tableHead.textContent = ''
    tableRow.append(tableHead)
    for (let elem of array) {
        const tableData = document.createElement('td')
        tableData.append(determineWeather(tableData, elem.weather[0].main, sunrise, sunset, dt))
        tableRow.append(tableData)
    }
    table.append(tableRow)
}
function createRowForecast(heading, array, table) { // СОздает строку с обозначение погоды в виде текста
    const tableRow = document.createElement('tr')
    const tableHead = document.createElement('th')
    tableHead.textContent = heading
    tableRow.append(tableHead)
    for (let elem of array) {
        const tableData = document.createElement('td')
        tableData.textContent = elem.weather[0].main
        tableRow.append(tableData)
    }
    table.append(tableRow)
}
function createRowTemp(heading, array, table) { // Создает  строку с температурой
    const tableRow = document.createElement('tr')
    const tableHead = document.createElement('th')
    tableHead.textContent = heading
    tableRow.append(tableHead)
    for (let elem of array) {
        const tableData = document.createElement('td')
        tableData.textContent = Math.round(elem.temp) + '\u00B0'
        tableRow.append(tableData)
    }
    table.append(tableRow)
}
function createRowTempDaily(heading, array, table) { // Создает строку с температурой для таблицы работающая с другими входными данными
    const tableRow = document.createElement('tr')
    const tableHead = document.createElement('th')
    tableHead.textContent = heading
    tableRow.append(tableHead)
    for (let elem of array) {
        const tableData = document.createElement('td')
        tableData.textContent = Math.round(elem.main.temp) + '\u00B0'
        tableRow.append(tableData)
    }
    table.append(tableRow)
}

function createRowFeelsLike(heading, array, table) { // Создает строку с температурой по ощущаемости
    const tableRow = document.createElement('tr')
    const tableHead = document.createElement('th')
    tableHead.textContent = heading
    tableRow.append(tableHead)
    for (let elem of array) {
        const tableData = document.createElement('td')
        tableData.textContent = Math.round(elem.feels_like) + '\u00B0'
        tableRow.append(tableData)
    }
    table.append(tableRow)
}
function createRowFeelsLikeDaily(heading, array, table) { // Создает строку с температурой по ощущаемости для таблицы работающая с другими входными данными
    const tableRow = document.createElement('tr')
    const tableHead = document.createElement('th')
    tableHead.textContent = heading
    tableRow.append(tableHead)
    for (let elem of array) {
        const tableData = document.createElement('td')
        tableData.textContent = Math.round(elem.main.feels_like) + '\u00B0'
        tableRow.append(tableData)
    }
    table.append(tableRow)
}
function createRowWind(heading, array, table) { //Создает строку с показанием ветра
    const tableRow = document.createElement('tr')
    const tableHead = document.createElement('th')
    tableHead.textContent = heading
    tableRow.append(tableHead)
    for (let elem of array) {
        const tableData = document.createElement('td')
        tableData.textContent = (elem.wind_speed * 3.6).toFixed(2) + " " + windRose(elem.wind_deg)
        tableRow.append(tableData)
    }
    table.append(tableRow)
}
function createRowWindDaily(heading, array, table) { //Создает строку с показанием ветра для таблицы работающая с другими входными данными
    const tableRow = document.createElement('tr')
    const tableHead = document.createElement('th')
    tableHead.textContent = heading
    tableRow.append(tableHead)
    for (let elem of array) {
        const tableData = document.createElement('td')
        tableData.textContent = (elem.wind.speed * 3.6).toFixed(2) + " " + windRose(elem.wind.deg)
        tableRow.append(tableData)
    }
    table.append(tableRow)
}