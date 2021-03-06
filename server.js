// initialisation du server
const express = require('express');
const bodyParser = require("body-parser");
const app = express();
var port = 4013;
// connexion a bdd
var MongoClient = require('mongodb').MongoClient
    , assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017/reservation';

app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended : true}));

// utilisation du moteur de rendu ejs
app.set('view engine', 'ejs');


app.get('/template', function (req, res) {
    var test = "hello world";
    res.render('index', {
        message: test
    });
});

//afficher l'index
app.get('/', function(req,res){
    res.sendFile(__dirname+'/index.html')
});

app.get('/get_clients', function(req,res){

    //
    get_clients(function(clients){
        console.log(clients);
        res.send(clients);
    });

    //

});

function get_clients(cb){
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("reservation");
        dbo.collection("clients").find({}).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            //res.send(result);
            cb(result);
            db.close();
        });
    });

}
// sur la route /hotels , j'envoie une réponse qui fait un rendu
// sur hotel qui se trouve dans views/hotels et je passe les data
// que j'ai récupéré dans la fonction get_clients()
app.get('/hotels', function (req, res) {
    get_hotels(function(hotels){
        console.log(hotels);
        res.render('hotel', {
            data: hotels
        });
        // res.send(hotels);
    });
})
app.get('/get_hotels', function(req,res){
   
    // mongodb vers hotels
    //
    get_hotels(function(hotels){
        console.log(hotels);
        res.send(hotels);
    });

    //
});

function get_hotels(cb){
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("reservation");
        dbo.collection("hotels").find({}).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            //res.send(result);
            cb(result);
            db.close();
        });
    });

}

app.get('/get_secteurs', function(req,res){
   
    // mongodb vers secteurs
    //
    get_secteurs(function(secteurs){
        console.log(secteurs);
        res.send(secteurs);
    });
    //
});


function get_secteurs(cb){
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("reservation");
        dbo.collection("secteurs").find({}).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            //res.send(result);
            cb(result);
            db.close();
        });
    });

}



// Use connect method to connect to the server
MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to bdd");
    db.close();
});


app.get('/admin/ajout-hotel', function (req, res) {
    res.sendFile(__dirname + '/ajout-hotel.html')
});


// A REVOIR - ne récupère pas les données dans newvalues

app.put('/update', function (req, res) {

    var monid = req.body.donnee1;
    var name = req.body.donnee2;
    var image = req.body.donnee3;
    var mark = req.body.donnee4;
    var secteur = req.body.donnee5;
    var myquery = { id: monid };
    
    var newvalues = { $set: { Nom: name, img: image, id_secteur: secteur, Nb_etoiles: mark } };
    // console.log("/update =>  " + JSON.parse(newvalues));


    MongoClient.connect(url, function (err, database) {
        if (err) throw err;
        var dbo = database.db("reservation");

       console.log(newvalues);
        dbo.collection("hotels").updateOne(myquery, newvalues, function (err, result) {
            // if (err) throw err;
            if (err){
                res.send('error');   
            }

            res.send('ok');
            console.log("1 document inserted");
            database.close();

        });
        
    });
    //on est gentil on repond
    // res.send("toto");
});



app.listen(port, function(){
    console.log('the port is on')
});

