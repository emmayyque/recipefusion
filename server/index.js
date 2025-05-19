const express = require('express')
const connectToMongo = require('./db')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const allRoutes = require('./routes/AllRoutes')
const cookieParser = require('cookie-parser')
require('dotenv').config()

connectToMongo()

const app = express()
const port = process.env.PORT

const corsOrigin = process.env.REACT_URL

const corsOptions = {
    origin: corsOrigin,
    methods: ["GET", "POST", "PUT", "PATCH", "OPTIONS", "DELETE"],
    credentials: true
}

// Middlewares
app.use(cors(corsOptions))

// Handle preflight requests
// app.options('*', cors());

// Serve static files (images)
app.use(express.json())

// Middleware to parse form-data requests
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookieParser())

// Available Routes
app.use("/api", allRoutes)

// Server Setup
app.listen(port, "0.0.0.0", () => {
    console.log(`App Listening at ${process.env.BASE_URL}:${port}`)
})