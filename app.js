var express = require('express');
var app = express();
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '../public'));
var twitterAPI = require('node-twitter-api');
var twitter = new twitterAPI({
  consumerKey: 'xUVJ7OkUYZgtG9KK3DyA',
  consumerSecret: '4qr6qV24XzsBVR7bljRwLefFXo1ggigocvDrYpAKRs',
  callback: 'oob'
});
var jade = require('jade');
var fn = jade.compile('./index.html');

app.get('/', function(req, res) {
  var accToken = '829348675-dB86OcFHh4wZOAizD4YREA8TAGhlwYoP0pTXzzy1';
  var accTokenSecret = 'IwRsYAGz9xZfaJWAU870slwsSaFJKT6v5WsIT1h5nI';
  twitter.search({q:'bart strike'}, accToken, accTokenSecret, function (error, data, response) {
    if (error) {
      console.log(JSON.stringify(error));
    }
    else { // success!!
      res.render('index.jade', {title: 'Franz Enzenhofer'});
      console.log(JSON.stringify(data));
    }
  });
});

app.get('/search', function(req, res) {
  res.end(req.query.querystring);
});

app.listen(3000);
