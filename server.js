
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const unirest = require('unirest');
const app = express()
const dotenv = require('dotenv').config();

const apiKey = process.env.API_Key;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index', {weather: null, error: null});
})

app.post('/', function (req, res) {
  let city = req.body.city;

  var req = unirest("GET", "https://community-open-weather-map.p.rapidapi.com/weather");

  req.query({
    "units": "imperial",
    "q": city
  });

  req.headers({
    "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
    "x-rapidapi-key": "693abeb32fmshe77710d4cc8c522p1a4603jsn32f6e8501ece",
    "useQueryString": true
  });


  req.end(function (result) {
    if (result.error) {
      res.render('index', {weather: null, error: 'Error, please try again'});
    } else {
      let weather = result.body;
      if (weather.main == undefined) {
        res.render('index', {weather: null, error: 'Error, please try again'});
      } else {
        let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
        res.render('index', {weather: weatherText, error: null});
      }
    }
  });
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})