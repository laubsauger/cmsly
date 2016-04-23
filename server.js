var http = require('http');
var path = require('path');

var async = require('async');
var express = require('express');

var router = express();
var server = http.createServer(router);

//--- app
var pageRenderer = require('./app/pageRenderer.js');

router.use(function(req, res){
  res.send(pageRenderer('home'));
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("server listening at", addr.address + ":" + addr.port);
});
