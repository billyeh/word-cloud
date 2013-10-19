// Import stuff
var express = require('express');
var twitterAPI = require('node-twitter-api');
var jade = require('jade');
var geocoder = require('geocoder');

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
  var geocode = "37.781157,-122.398720,4000mi";
  twitter.search({q:query, geocode:geocode}, accToken, accTokenSecret, function (error, data, response) {
    if (error) {
      console.log(JSON.stringify(error));
    }
    else { // success!!
      var tweets = extract_data(data);
      var locations = extract_locations(data);
      res.render('results.jade', {tweets:JSON.stringify(tweets), locations:JSON.stringify(locations)});
    }
  });
});

app.listen(3000);


function extract_data (data) {
  var tweets = [];
  //console.log(JSON.stringify(data));
  for (var i=0; i< data.statuses.length; i++) {
    tweets.push({name:data.statuses[i].user.screen_name, 
      text:data.statuses[i].text, 
      tags:data.statuses[i].entities.hashtags, 
      time:data.statuses[i].created_at, 
      //place:data.statuses[i].place,
  	  geo:data.statuses[i].geo,
  	  coordinates:data.statuses[i].coordinates,
  	  location:data.statuses[i].user.location
  	 });
  }
  console.log(JSON.stringify(tweets));
  return tweets;
}

function extract_locations (data) {
	var tweets = extract_data(data);
	var locations = [];
	for (var i=0; i < tweets.length; i++) {
		if (!tweets[i].geo) {
			geocoder.geocode(tweets[i].location, function (err, data) {
				if (err) {
			    	console.log(JSON.stringify(err));
			    }
			    else { // success!!
			    	console.log(data);
			    	locations.push(data);
			    }
			});
		} else {
			locations.push(tweets[i].geo.coordinates);
		}
	}
	console.log(JSON.stringify(locations));
	return locations;
}

function encode_URI(uri) {
  return encodeURIComponent(uri.replace(/\!/g, "%21")
             .replace(/\'/g, "%27")
             .replace(/\(/g, "%28")
             .replace(/\)/g, "%29")
             .replace(/\*/g, "%2A"));
}
