var express = require('express');
var app = express();

app.get('/', function(req, res) {
  client.get("https://api.twitter.com/1.1/search/tweets.json?q=bart%20strike", function(data, response){
            // parsed response body as js object
            console.log(data);
            // raw response
            console.log(response);
        });
  res.end('hello');
});

app.listen(3000);
