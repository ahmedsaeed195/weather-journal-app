/* Global Variables */
const url = 'https://api.openweathermap.org/data/2.5/weather?'
// Personal API Key for OpenWeatherMap API
const apiKey = '&appid=cad65a6773ad842cc52fd7ea5acc6cd1&units=metric'
// Create a new date instance dynamically with JS
let d = new Date()
let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear()
// Define global variable location which holds the geolocation coords of the user
let locationData = []

const data = {
    date: '',
    temp: '',
    zip: '',
    feelings: ''
}

function getLocation() {
    //#region Handlers for geo location
    const setPosition = (position) => {
        //save location information in global variable location
        locationData = [position.coords.latitude, position.coords.longitude]
        console.log(locationData)
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
        console.log(await request.json())
    } catch (err) {
        console.log(err)
    }
}
// setTimeout(() => {
//     getWeatherData()
// }, 2000)

//Submit button handler
async function submit() {
    const updateView = () => {

    }
    try {
        const request = await fetch('/', {
            method: 'POST',
            body: JSON.stringify(data)
        })
    } catch (err) {
        console.log(err)
    }
}

//Zip code input change handler
function zipChange(value) {
    data.zip = value
    console.log(data)
}

//Filter Zip code field to only accept numerical values
function zipFilter(target) {
    target.value = target.value.replace(/[^0-9]/g, '').replace(/(\..*)\./g, '$1')
}

function feelingsChange(value) {
    data.feelings = value
    console.log(data)
}