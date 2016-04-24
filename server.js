var http = require('http');https://cms-laubsauger.c9users.io/
var path = require('path');

var async = require('async');
var express = require('express');
var favicon = require('serve-favicon');

var router = express();
var server = http.createServer(router);
var _ = require('lodash');

//--- app
var pageRenderer = require('./app/pageRenderer.js');
var fileHelper = require('./app/fileHelper.js');

router.use(express.static('public'));

router.get('*', function (req, res) {
    console.log(req.path);
    var page = req.path.slice(1); 
    
    if (_.indexOf(fileHelper.getPagesFolderIndex(), page) !== -1) {
        console.log('serving page: ' + page);
        res.send(pageRenderer('home'));
        return;
    }
    
    console.error('page "' + page + '" does not exist yet');
    res.send('The page <b>' + req.path + '</b> does not exist yet.');
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("server listening at", addr.address + ":" + addr.port);
});
