export {setDate, getHours, getHoursAndMinutes}

function setDate(dt) { // Выводит дату в нужном нам виде
    let date = new Date(dt * 1000)
    return date = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear()

}

export default function getHours(date) { //Преобразовывает часы
    let re = /:\d+:\d+/g;
    let deleteN = re.exec(date)[0];
    let newString = date.replace(deleteN, '')
    return newString.replace(/ /g, '').toLowerCase();
}

function getHoursAndMinutes(date) { // Выводит часы и минуты
    let re = /:\d+/g;
    re.lastIndex = 4
    let deleteN = re.exec(date)[0];
    let newString = date.replace(deleteN, '')
    return newString;
}


