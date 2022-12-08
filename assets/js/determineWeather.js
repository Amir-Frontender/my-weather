export {determineWeather, duration}

export default function determineWeather(elem, weather, sunrise, sunset, date) { //В зависимости от погоды выводит нужную иконку
    const icon = document.createElement('img')
    icon.className = 'icon'
    icon.alt = 'icon'
    switch (weather) {
        case 'Thunderstorm': icon.src = './assets/icons/thunderstorm.svg'; break;
        case 'Drizzle': icon.src = './assets/icons/drizzle.svg'; break;
        case 'Rain': icon.src = './assets/icons/rain.svg'; break;
        case 'Snow': icon.src = './assets/icons/snow.svg'; break;
        case 'Mist': icon.src = './assets/icons/mist.svg'; break;
        case 'Smoke': icon.src = './assets/icons/mist.svg'; break;
        case 'Haze': icon.src = './assets/icons/mist.svg'; break;
        case 'Fog': icon.src = './assets/icons/mist.svg'; break;
        case 'Dust': icon.src = './assets/icons/dust.png'; break;
        case 'Ash': icon.src = './assets/icons/dust.png'; break;
        case 'Clear': if (date < sunrise && date > sunset) { //В зависимости от времени суток меняет иконку
            icon.src = './assets/icons/clear_night.svg'; break;
        } else icon.src = './assets/icons/clear_day.svg'; break;
        case 'Clouds': icon.src = './assets/icons/clouds.svg'; break;
        case 'Squall': icon.src = './assets/icons/tornado.svg'; break;
        case 'Tornado': icon.src = './assets/icons/tornado.svg'; break;
        default: break;
    }
    elem.append(icon)
    return icon
}
function addZero (num) { // Функция добавления нуля при единичном числе
    return num < 10 ? `0${num}` : num
}
function duration(sunrise, sunset) { //Определяет продолжительность дневного времени
    let seconds = sunset - sunrise;
    let hours = Math.floor(seconds / 3600)
    let minutes = Math.floor(seconds / 60) - hours * 60
    let time = "Duration: " + hours + ":" + addZero(minutes) + " hr"
    return time

}
