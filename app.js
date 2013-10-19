var express = require('express');
var app = express();
var twitterAPI = require('node-twitter-api');
var twitter = new twitterAPI({
  consumerKey: 'xUVJ7OkUYZgtG9KK3DyA',
  consumerSecret: '4qr6qV24XzsBVR7bljRwLefFXo1ggigocvDrYpAKRs',
  callback: 'oob'
});

app.get('/', function(req, res) {
  var accToken = '829348675-dB86OcFHh4wZOAizD4YREA8TAGhlwYoP0pTXzzy1';
  var accTokenSecret = 'IwRsYAGz9xZfaJWAU870slwsSaFJKT6v5WsIT1h5nI';
  twitter.search({q:'bart strike'}, accToken, accTokenSecret, function (error, data, response) {
    if (error) {
      console.log(JSON.stringify(error));
    }
    else {
      console.log(JSON.stringify(data));
    }
  });
  res.end('hello');
});

app.listen(3000);
