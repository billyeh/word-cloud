// Import stuff
var express = require('express');
var twitterAPI = require('node-twitter-api');
var jade = require('jade');
var request = require('request');
var fs = require('fs');

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
  var geocode = "37.781157,-122.398720,4000mi";
  var count = 100;
  twitter.search({q:query, count: count, geocode:geocode}, accToken, accTokenSecret, function (error, data, response) {
    if (error) {
      console.log(JSON.stringify(error));
    }
    else { // success!!
      extract_data(data, query, res);
    }
  });
});

app.get('/constrained-zoom.svg', function(req, res) {
  var img = fs.readFileSync('./images/constrained-zoom.svg');
  res.writeHead(200, {'Content-Type': 'image/gif' });
  res.end();
});

app.listen(3000);

// Helper functions
function extract_data (data, query, res) {
  data.statuses.forEach(function(element, index) {
    var endpoint = 'http://www.sentiment140.com/api/classify?';
    var tweet = {
          id:element.id,
          name:element.user.screen_name, 
          text:relink(element.text), 
          tags:element.entities.hashtags, 
          time:element.created_at.split('+')[0] + element.created_at.split('+')[1].split(' ')[1],
          location:element.user.location,
      	  coordinates:element.geo};
    endpoint += 'text=' + encode_URI(element.text);
    endpoint += '&query=' + encode_URI(query);
    request(endpoint, function(error, response, body) {
      if (error) {
        console.log(JSON.stringify(error));
      }
      if (!error && body) {
        tweet.sentiment = JSON.parse(body).results.polarity;
        var geocodeURL = "http://open.mapquestapi.com/geocoding/v1/address?key=Fmjtd%7Cluubnuu12d%2C25%3Do5-9u1xlw&location="
        if (!tweet.coordinates) {
        	var geoQuery = encodeURIComponent(tweet.location);
        	request(geocodeURL+geoQuery, function (err, response, body){
        		if (error) {
        			console.log(JSON.stringify(error));
        		}
        		if (!error && body) {
        			data_geo = JSON.parse(body);
	        		if (data_geo.results[0].locations[0]) {
						var lat = data_geo.results[0].locations[0].displayLatLng.lat;
						var lng = data_geo.results[0].locations[0].displayLatLng.lng;
						var latlng = [lat, lng];
						tweet.coordinates = latlng;
						tweets.push(tweet);
						if (index == data.statuses.length-1) {
				          res.render('results.jade', {data:JSON.stringify(tweets)});
				        }
					}
        		}
        	});
        }
        tweets.push(tweet);
        if (index == data.statuses.length-1) {
          res.render('results.jade', {data:JSON.stringify(tweets), q:query});
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

function relink(link) {
  var ret = link.replace(/http:\/\/([a-z0-9_\.\-\+\&\!\#\~\/\,]+)/ig,
    '<a href="http://$1" target="_blank">http://$1</a>');
  ret = ret.replace(/@([a-z0-9_\.\-\+\&\!\#\~\/\,]+)/ig,
    '<a href="https://twitter.com/$1" target="_blank">@$1</a>');
  return ret;
}
