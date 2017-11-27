// Inclusion de Mongoose
var mongoose = require('mongoose');
 
// On se connecte à la base de données
// N'oubliez pas de lancer ~/mongodb/bin/mongod dans un terminal !
mongoose.connect('mongodb://localhost/Amazon', function(err) {
  if (err) { throw err; }
});
 
/********** Partie Création des clients **********/

// Création du schéma pour les clients
var clientSchema = new mongoose.Schema({
	nom : { type : String, match: /^[a-zA-Z0-9-_]+$/ },
	prenom : { type : String, match: /^[a-zA-Z0-9-_]+$/ },  
	pseudo : { type : String, match: /^[a-zA-Z0-9-_]+$/ },
	argent : Number,
	date : { type : Date, default : Date.now }
});
 
// Création du Model pour les clients
var ClientModel = mongoose.model('clients', clientSchema);
 
// On crée une instance du Model client
var monClient= new ClientModel({ nom : 'Boi', prenom : 'Romain', pseudo : 'Romrom', argent: 10000 });

// On sauvegarde le client dans MongoDB !
monClient.save(function (err) {
	if (err) { throw err; }
		console.log('Client ajouté avec succès !');
		mongoose.connection.close();
}); 


/********** Partie Création des items **********/

// Création du schéma pour les items
var itemSchema = new mongoose.Schema({
	nom : { type : String, match: /^[a-zA-Z0-9-_]+$/ },
	prix : Number,
	description : String,
	date : { type : Date, default : Date.now }
});

// Création du Model pour les items
var ItemModel = mongoose.model('items', itemSchema);
 
// On crée une instance du Model item
var monItem= new ItemModel({ nom : 'voiture', prix : 100 });
monItem.description = "Une très belle voiture rouge toute neuve";

// On sauvegarde l'item dans MongoDB !
monItem.save(function (err) {
	if (err) { throw err; }
  		console.log('Item ajouté avec succès !');
}); 

/********** Partie Création des paniers **********/

// Création du schéma pour les paniers
var panierSchema = new mongoose.Schema({
	id_client : String,
	items : [{id_item : String, nom : String, prix : Number}],
	date : { type : Date, default : Date.now }
});

// Création du Model pour les paniers
var PanierModel = mongoose.model('paniers', panierSchema);
 
// On crée une instance du Model panier
var monPanier= new PanierModel({ id_client : monClient._id });
monPanier.items = { id_item : monItem._id, nom : monItem.nom, prix : monItem.prix};

// On sauvegarde le panier dans MongoDB !
monPanier.save(function (err) {
	if (err) { throw err; }
		mongoose.connection.close();
		console.log('Panier ajouté avec succès !'); 
}); 

