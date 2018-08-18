'use strict';

var express = require( 'express' );
var argv = require('minimist')(process.argv.slice(2));
var bodyParser = require( 'body-parser' );
const lesson = require('./routes/lesson');
const mongoose = require('mongoose');
const passport = require('passport');
const axios = require("axios");
const util = require("./common/util.js");

var app = express();
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, Authorization, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  
    next();
  });
  
// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var subpath = express();  
app.use("/", subpath);
var swagger = require("swagger-node-express").createNew(subpath);

app.use(express.static('dist'));

swagger.setApiInfo({
        title: "Backend API",
        description: "Backend API",
        termsOfServiceUrl: "",
        contact: "info@hnn.com",
        license: "",
        licenseUrl: ""
});

app.get('/', function (req, res) {
        res.sendFile(__dirname + '/dist/index.html');
});

swagger.configureSwaggerPaths('', 'api-docs', '');

// Configure the API domain
var domain = 'localhost';
if(argv.domain !== undefined)
    domain = argv.domain;
else
    console.log('No --domain=xxx specified, taking default hostname "localhost".')

// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);
    
app.use('/lesson', lesson);

// Server static assets if in production
if (process.env.REACT_APP_RUNNING_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const port = process.env.PORT || 5001;
    



// Set and display the application URL
var applicationUrl = 'http://' + domain + ':' + port;
console.log('snapJob API running on ' + applicationUrl);


swagger.configure(applicationUrl, '1.0.0');

// Start the web server
app.listen(port, () => console.log(`Lesson service running on port ${port}`));
