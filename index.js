var express = require('express');
var app = express();
var fs = require("fs");
var bodyParser = require('body-parser')
app.use( bodyParser.json() );      
app.use(bodyParser.urlencoded({  extended: true }));


app.get('/', function (req, res) {
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
      res.end( data );
   });
})

app.get('/:id', function (req, res) {
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
      var users = JSON.parse( data );
      var user = users["user" + req.params.id] 
     res.end( JSON.stringify(user));
   });
})

var bodyParser = require('body-parser')
app.use( bodyParser.json() );      
app.use(bodyParser.urlencoded({  extended: true }));

app.post('/', function (req, res) {
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
      var users = JSON.parse( data );
      var user = req.body.user5;
      users["user"+user.id] = user
      res.end( JSON.stringify(users));
   });
})

app.delete('/:id', function (req, res) {
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
      data = JSON.parse( data );
      var id = "user"+req.params.id;
      var user = data[id];
      delete data[ "user"+req.params.id];
      res.end( JSON.stringify(data));
   });
})
app.put("/:id", function(req, res) {
      fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
      
      var users = JSON.parse( data );
      var id = "user"+req.params.id;
      
      users[id]=req.body;
      res.end( JSON.stringify(users));
   })

})
var server = app.listen(5000, function () {
   console.log("Express App running at http://127.0.0.1:5000/");
})