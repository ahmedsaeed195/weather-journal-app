/* Global Variables */
const url = 'https://api.openweathermap.org/data/2.5/weather?'
// Personal API Key for OpenWeatherMap API
const apiKey = '&appid=cad65a6773ad842cc52fd7ea5acc6cd1&units=metric'
// Create a new date instance dynamically with JS
let d = new Date()
let newDate = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear()
// Define global variable location which holds the geolocation coords of the user
let locationData = []

const data = {
    date: newDate,
    temp: '',
    zip: '',
    feelings: ''
}

function getLocation() {
    //#region Handlers for geo location
    const setPosition = (position) => {
        //save location information in global variable location
        locationData = [position.coords.latitude, position.coords.longitude]
    }

    const geoLocationErrorHandler = (GeolocationPositionError) => {
        switch (GeolocationPositionError.code) {
            case 1:
                alert('Geolocation must be enabled for this application to work')
                break
            case 2:
                alert('Geolocation must be enabled for this application to work, please make sure that you are on a browser with Geolocation enabled on it')
                break
            default:
                alert('Geolocation timeout!!')
        }
    }
    //#endregion
    navigator.geolocation.getCurrentPosition(setPosition, geoLocationErrorHandler)
}

// Call getLocation function once the document loads to get access to the use location info such as lat and long
getLocation()

//Function to get weather data
async function getWeatherData() {
    try {
        const request = await fetch(url + `lat=${locationData[0]}&lon=${locationData[1]}` + apiKey)
        const resData = await request.json()
        data.temp = resData.main.temp
    } catch (err) {
        console.log(err)
    }
}

//Zip code input change handler
function zipChange(value) {
    data.zip = value
}

//Filter Zip code field to only accept numerical values
function zipFilter(target) {
    target.value = target.value.replace(/[^0-9]/g, '').replace(/(\..*)\./g, '$1')
}
//Feelings input change handler
function feelingsChange(value) {
    data.feelings = value
}

//Submit button handler
async function submit() {
    //Update UI handler
    const updateView = (data) => {
        const date = document.getElementById('date')
        const temp = document.getElementById('temp')
        const content = document.getElementById('content')
        date.innerHTML = `Date: ${data.date}`
        temp.innerHTML = `Temperature: ${data.temp} °C`
        //Formating the feelings section to match the input
        const feelings = data.feelings.replace('\n', '<br/>' + Array(15).fill('\xa0').join(''))
        content.innerHTML = `Zipcode: ${data.zip}<br/> Feelings: ${feelings}`
    }
    //#region check for data before submit
    if (!data.zip) {
        alert('Please insert your zipcode')
        return
    }
    if (!data.feelings) {
        alert('Please insert how you are feeling today')
        return
    }
    //#endregion
    try {
        //Get weather data first
        await getWeatherData()
        if (!data.temp) {
            alert('Please enable location detection and refresh the page for the app to work')
            return
        }
        const request = await fetch('/', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data)
        })
        const response = await request.json()
        if (response) {
            const getData = await fetch('/all')
            const serverData = await getData.json()
            updateView(serverData)
        }
    } catch (err) {
        console.log(err)
    }
}