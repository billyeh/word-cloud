// Import stuff
var express = require('express');
var twitterAPI = require('node-twitter-api');
var jade = require('jade');

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
      var tweets = extract_data(data);
      res.render('results.jade', {data:JSON.stringify(tweets)});
    }
  });
});

app.listen(3000);


function extract_data (data) {
  var tweets = [];
  for (var i=0; i< data.statuses.length; i++) {
    tweets.push({name:data.statuses[i].user.screen_name, 
      text:data.statuses[i].text, 
      tags:data.statuses[i].entities.hashtags, 
      time:data.statuses[i].created_at, 
      loc:data.statuses[i].place});
    console.log(tweets[i].text);
  }
  // console.log(JSON.stringify(tweets));
  return tweets;
}

function encode_URI(uri) {
  return encodeURIComponent(uri.replace(/\!/g, "%21")
             .replace(/\'/g, "%27")
             .replace(/\(/g, "%28")
             .replace(/\)/g, "%29")
             .replace(/\*/g, "%2A"));
}
