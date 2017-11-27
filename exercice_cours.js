var express = require('express');
var app = express();
var fs = require("fs");

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/projet';

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'null');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


var getcuisines = function(db, callback) {
    db.collection('restaurants').distinct(
        "cuisine", function(err, docs){
            callback(docs.sort());
        }
    );
};


app.get('/restaurants', function (req, res) {
    res.send(JSON.stringify({'restaurants': []}));
    // TODO: Return a list of meaningful restaurants
});

app.get('/cuisines', function (req, res) {
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        getcuisines(db, function(r) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({'cuisines': r}));
            db.close();
        });
    });
});

var server = app.listen(8081, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("App listening at http://%s:%s", host, port)

});
