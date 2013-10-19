var express = require('express');
var app = express();
var twitterAPI = require('node-twitter-api');
var twitter = new twitterAPI({
  consumerKey: 'xUVJ7OkUYZgtG9KK3DyA',
  consumerSecret: '4qr6qV24XzsBVR7bljRwLefFXo1ggigocvDrYpAKRs',
  callback: 'oob'
});

app.get('/', function(req, res) {
  var reqToken;
  var reqTokenSecret;
  twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results){
    if (error) {
      console.log("Error getting OAuth request token : " + JSON.stringify(error));
    } else {
      reqToken = requestToken;
      reqTokenSecret = requestTokenSecret;
    }
  });
  res.end('hello');
});

app.listen(3000);
