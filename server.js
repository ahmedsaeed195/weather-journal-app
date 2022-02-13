// Setup empty JS object to act as endpoint for all routes
let projectData = {}

// Require Express to run server and routes
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
// Start up an instance of app
const app = express()
/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors())

// Initialize the main project folder
app.use(express.static('website'));

//#region Server Routes
//Load view on default URL
app.get('/', async (req, res) => {
    res.sendFile('index.html')
})
//Get last entry method
app.get('/all', (req, res) => {
    console.log(projectData)
    return res.status('200').json(projectData)
})
//Post data method
app.post('/', (req, res) => {
    const data = req.body
    projectData = data
    return res.status('201').json({
        message: 'Data Saved'
    })
})
// Setup Server
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`listening to port ${port}`))