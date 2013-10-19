var express = require('express');
var Client = require('node-rest-client').Client;
client = new Client();
var app = express();

app.get('/', function(req, res) {
  data = {oauth_consumer_key="DC0sePOBbQ8bYdC8r4Smg",
          oauth_signature_method="HMAC-SHA1",
          oauth_timestamp="1382152316",
          oauth_nonce="1673638167",
          oauth_version="1.0",
          oauth_token="829348675-NaGUOKrut1NQ8HrElShZKWVWpxGKD1iS6nWcM1Qg",
          oauth_signature="Es6ZEnhIRN2DEDxwEyMPMXBDFIs%3D"
        }
  client.get("https://api.twitter.com/1.1/search/tweets.json?q=bart%20strike", function(data, response){
            // parsed response body as js object
            console.log(data);
            // raw response
            console.log(response);
        });
  res.end('hello');
});

app.listen(3000);
