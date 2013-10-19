// Import stuff
var express = require('express');
var twitterAPI = require('node-twitter-api');
var jade = require('jade');
var request = require('request');

// Configuration of Express
var app = express();
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '../public'));
app.configure(function(){
  app.use(express.bodyParser());
  app.use(app.router);
});

// Twitter API keys
var twitter = new twitterAPI({
  consumerKey: 'xUVJ7OkUYZgtG9KK3DyA',
  consumerSecret: '4qr6qV24XzsBVR7bljRwLefFXo1ggigocvDrYpAKRs',
  callback: 'oob'
});
var accToken = '829348675-dB86OcFHh4wZOAizD4YREA8TAGhlwYoP0pTXzzy1';
var accTokenSecret = 'IwRsYAGz9xZfaJWAU870slwsSaFJKT6v5WsIT1h5nI';

// Routing
var tweets = [];
var sentiments = [];
app.get('/', function(req, res) {
  res.render('index.jade');
});

app.post('/search', function(req, res) {
  var query = encode_URI(req.body.querystring);
  var count = 100;
  twitter.search({q:query, count: count}, accToken, accTokenSecret, function (error, data, response) {
    if (error) {
      console.log(JSON.stringify(error));
    }
    else { // success!!
      extract_data(data, query, res);
    }
  });
});

app.listen(3000);

function extract_data (data, query, res) {
  data.statuses.forEach(function(element, index) {
    var endpoint = 'http://www.sentiment140.com/api/classify?';
    var tweet = {name:element.user.screen_name, 
          text:element.text, 
          tags:element.entities.hashtags, 
          time:element.created_at, 
          loc:element.place};
    endpoint += 'text=' + encode_URI(element.text);
    endpoint += '&query=' + encode_URI(query);
    request(endpoint, function(error, response, body) {
      console.log(JSON.stringify(tweet));
      if (error) {
        console.log(JSON.stringify(error));
      }
      if (!error && body) {
        tweet.sentiment = JSON.parse(body).results.polarity;
        tweets.push(tweet);
        if (index == data.statuses.length-1) {
          res.render('results.jade', {data:JSON.stringify(tweets)});
        }
      }
    });
  });
}

function encode_URI(uri) {
  if (uri) {
    return encodeURIComponent(uri.replace(/\!/g, "%21")
             .replace(/\'/g, "%27")
             .replace(/\(/g, "%28")
             .replace(/\)/g, "%29")
             .replace(/\*/g, "%2A"));
  }
}

function get_sentiment(tweet_text, query) {
  var endpoint = 'http://www.sentiment140.com/api/classify?';
  var sentiment = 2;
  endpoint += 'text=' + encode_URI(tweet_text);
  endpoint += '&query=' + encode_URI(query);
  request(endpoint, function(error, response, body) {
    if (error) {
      console.log(JSON.stringify(error));
    }
    if (!error && body) {
      sentiment = JSON.parse(body).results.polarity;
      sentiments.push(sentiment);
    }
  });
}
