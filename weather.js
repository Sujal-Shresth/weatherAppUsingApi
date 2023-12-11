let API_KEY = '7a5efd968b1f2cb9c20eb07f93e1569c';

let serachButton = document.getElementById("searchButton");
serachButton.addEventListener('click', removeIntro);

let inputField = document.getElementById("input");

let placeName = document.getElementById("placeName");
let date = document.getElementById("date");
let temperature = document.getElementById("temperature");
let weather = document.getElementById("weather");
let description = document.getElementById("description");
let minMaxtemp = document.getElementById("minMaxtemp");
let humidity = document.getElementById("humidity");
let pressure = document.getElementById("pressure");

function formatDate(date) {
    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var daySuffix = getDaySuffix(day);
    var formattedDate = day + daySuffix + ' ' + monthNames[monthIndex] + ', ' + year;

    return formattedDate;
}

function getDaySuffix(day) {
    if (day >= 11 && day <= 13) {
        return 'th';
    }
    var lastDigit = day % 10;
    switch (lastDigit) {
        case 1:
            return 'st';
        case 2:
            return 'nd';
        case 3:
            return 'rd';
        default:
            return 'th';
    }
}

var currentDate = new Date();
date.innerText = formatDate(currentDate);

function removeIntro() {
    if (inputField.value) {
        document.getElementById("intro").style.display = "none";
        document.getElementById("content").style.display = "block";
        serachButton.removeEventListener('click', removeIntro);
        serachButton.addEventListener('click', searchWeather);
        searchWeather();
    }
    else {
        inputField.style.boxShadow = "0 0 10px rgba(255, 152, 0, 0.5)";
        inputField.placeholder = "ENTER A VALID CITY NAME";
    }
}

function searchWeather() {
    let city = inputField.value;
    getCoordinates(city);
}

function getCoordinates(city) {
    fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
    )
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            console.log(data[0].lat, data[0].lon);
            getWeather(data[0].lat, data[0].lon)
        })
        .catch((error) => {
            inputField.style.boxShadow = "0 0 10px rgba(255, 152, 0, 0.5)";
            inputField.value = "";
            inputField.placeholder = "ENTER A VALID CITY NAME";
            console.log(error);
        });
}

function getWeather(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
        .then((res) => res.json())
        .then((data) => {
            inputField.style.boxShadow = "";
            inputField.placeholder = "Search For your City";
            console.log(data);
            placeName.innerText = data.name;
            temperature.innerText = kelvinToCelsius(data.main.temp) + "°c";
            weather.innerText = data.weather[0].main;
            description.innerText = data.weather[0].description;
            minMaxtemp.innerText = kelvinToCelsius(data.main.temp_min) + " / " + kelvinToCelsius(data.main.temp_max);
            humidity.innerText = data.main.humidity + "%";
            pressure.innerText = data.main.pressure + " mb";
        }).catch((error) => {
            inputField.style.boxShadow = "0 0 10px rgba(255, 152, 0, 0.5)";
            inputField.value = "";
            inputField.placeholder = "ENTER A VALID CITY NAME";
            console.log(error);
        });
}

function kelvinToCelsius(kelvin) {
    var celsius = kelvin - 273.15;
    celsius = Math.round(celsius * 100) / 100;
    return celsius;
}
