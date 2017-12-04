var express = require('express');
var app = express();
var fs = require("fs");

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/Amazon';

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'null');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

/********** Récupérer un attributs d'une collection (ici la collection items,attribut nom) **********/

/* méthode retournant les différents 'noms' de la collection items*/
var getItems = function(db,callback){
    db.collection('items').distinct(
        "nom", function(err, docs){
            callback(docs.sort());
        }
    );
};


/* Appel serveur pour récuprérer les différents 'nom' de la collections items */
app.get('/items',function(req,res){
	MongoClient.connect(url, function(err, db) {
	        assert.equal(null, err);
	        getItems(db, function(r) {
	            res.setHeader('Content-Type', 'application/json');
	            res.send(JSON.stringify({'nom':r}));
	            db.close();
	        });
	});
});


/********** Récupérer tous les les élements d'une collection (ici la collection clients) **********/

/* Récupérer tous les éléments d'une collection */
var getAllClients = function(db,callback){
	db.collection('clients').find().toArray(function (err, result) {
		if (err) {
        		console.error('Find failed', err);
    		} else {
        		console.log('Find successful', result);
    		}
	callback(result);	
	});
	
};

app.get('/clients', function(req,res){
	MongoClient.connect(url, function(err, db) {
	        assert.equal(null, err);
	        getAllClients(db, function(r) {
	            res.setHeader('Content-Type', 'application/json');
	            res.send(JSON.stringify({'clients':r}));
	            db.close();
	        });
	});
});

/********** Récupérer toutes les valeurs de "attr" passer en paramètre **********/
var getItemsSpec = function(db,attr,callback){
    db.collection('items').distinct(
        attr, function(err, docs){
            callback(docs.sort());
        }
    );
};

app.get('/items/:attr/valeurs',function(req,res){
	var attr = req.params.attr;
	MongoClient.connect(url, function(err, db) {
	        assert.equal(null, err);
	        getItemsSpec(db,attr,function(r) {
	            res.setHeader('Content-Type', 'application/json');
	            res.send(JSON.stringify(r));
	            db.close();
	        });
	});
});

/********** Récupérer tous les items qui ont l'attribut "attr" passer en paramètre **********/
/********** Amélioration possible --> pas besoin de spécifier "prix" et "nom" **********/
var getItemsSpecAll = function(db,attr,callback){
	/* On selectionne que les objets qui ont l'attribut attr et on affiche leur id, nom et prix*/
	db.collection('items').find({},{attr:true,prix:true,nom:true}).toArray(function (err, result) {
		if (err) {
        		console.error('Find failed', err);
    		} else {
        		console.log('Find successful', result);
    		}
	callback(result);	
	});
};

app.get('/items/:attr',function(req,res){
	var attr = req.params.attr;
	MongoClient.connect(url, function(err, db) {
	        assert.equal(null, err);
	        getItemsSpecAll(db,attr	, function(r) {
	            res.setHeader('Content-Type', 'application/json');
	            res.send(JSON.stringify({'items':r}));
	            db.close();
	        });
	});
});


/**********  Appel serveur **********/
var server = app.listen(8081, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("App listening at http://%s:%s", host, port)

});
