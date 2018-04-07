// Set up dependencies
const express = require('express'),
      exphbs = require('express-handlebars'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      axios = require('axios'),
      cheerio = require('cheerio');

// Set up models
const db = require("./models");

// Set up Express variables
const PORT = process.env.PORT || 3000,
      app = express();

// Set up public directory
app.use(express.static("public"));

// Set up Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up routes
require("./routes/api")(app);

// Set up Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Set up Mongoose and MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/videoGameDB';
mongoose.Promise = Promise;

// Connect to MongoDB
mongoose.connect(MONGODB_URI);

// Function to log message once app is started
const appStarted = () => console.log(`Video Game Scraper running at: http://localhost:${PORT}`);

// Start app
app.listen(PORT, appStarted);
