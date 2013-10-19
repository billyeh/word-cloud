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
  var oauth_verifier = 6184592;
  var accToken;
  var accTokenSecret;
  twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results){
    if (error) {
      console.log("Error getting OAuth request token : " + JSON.stringify(error));
    } else {
      reqToken = requestToken;
      reqTokenSecret = requestTokenSecret;
      console.log('Request token:' + reqToken);
      console.log('Request token secret:' + reqTokenSecret);
    }
  });
  twitter.getAccessToken(reqToken, reqTokenSecret, oauth_verifier, function(error, accessToken, accessTokenSecret, results) {
    if (error) {
      console.log(JSON.stringify(error));
    } else {
      /*
      accToken = accessToken;
      accTokenSecret = accessTokenSecret;
      console.log('Access token:' + accToken);
      console.log('Access token secret:' + accTokenSecret);
      */
    }
  });
  res.end('hello');
});

app.listen(3000);
