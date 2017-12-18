

// app.js
var express = require('express');
var app = express();
var exphbs  = require('express-handlebars');

// REQUIRE HTTP MODULE
var http = require('http');

// INITIALIZE THE GIPHY-API LIBRARY
var giphy = require('giphy-api')();

// Root Route
app.get('/', function (req, res) {
  var queryString = req.query.term;
  // ENCODE THE QUERY STRING TO REMOVE WHITE SPACES AND RESTRICTED CHARACTERS
  var term = encodeURIComponent(queryString);
  // PUT THE SEARCH TERM INTO THE GIPHY API SEARCH URL
  var url = 'http://api.giphy.com/v1/gifs/search?q=' + term + '&api_key=dc6zaTOxFJmzC'

  http.get(url, function(response) {
    // SET ENCODING OF RESPONSE TO UTF8
    response.setEncoding('utf8');

    var body = '';

    response.on('data', function(d) {
      // CONTINUOUSLY UPDATE STREAM WITH DATA FROM GIPHY
      body += d;
    });

    response.on('end', function() {
      // WHEN DATA IS FULLY RECEIVED PARSE INTO JSON
      var parsed = JSON.parse(body);
      // RENDER THE HOME TEMPLATE AND PASS THE GIF DATA IN TO THE TEMPLATE
      res.render('home', {gifs: parsed.data})
    });
  });
});

app.get('/', function (req, res) {
  giphy.search(req.query.term, function (err, response) {
    res.render('home', {gifs: response.data})
  });
});

// express handlebars library for html templating
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static('public'));




// // index.js new route
// app.get('/greetings/:name', function (req, res) {
//   var name = req.params.name;
//   res.render('greetings', {name: name});
// })
//
// // hello gif route
// app.get('/hello-gif', function (req, res) {
//   var gifUrl = 'http://media2.giphy.com/media/gYBVM1igrlzH2/giphy.gif'
//   res.render('hello-gif', {gifUrl: gifUrl})
// })

// Setup server to listen on port 3000
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
