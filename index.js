const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const mongodb = require('mongodb');
const uploadFile = require('./uploadfile.js').uploadFile;

const config = {
  DB: 'mongodb://mongo'
};
const optiondDB = {
  useNewUrlParser: true
};

const PORT = 3000;
const client = mongodb.MongoClient;

var dbo;

client.connect(config.DB, optiondDB, function(err, db) {
  if (err) {
    console.log('database is not connected')
  } else {
    console.log('connected!!');
    dbo = db.db('midb');
  }
});

app.use(fileUpload());

app.get('/', function(req, res) {
  res.json({"hello": "express with mongo"});
});

app.get('/pokedex', function(req, res) {
  let data = dbo.collection('pokedex').find({}).toArray((err, result) => {
    if (err) {
      throw err;
    }
    res.json(result);
  });
});

app.delete('/pokedex/:id', function(req, res) {
  dbo.collection('pokedex').remove({id:req.params.id}, function(err, obj) {
    if (err) {
      throw err;
    }
    console.log("document with id " + req.params.id + "deleted");
    res.json(obj);
  });
});

app.listen(PORT, function() {
  console.log('Your node js server is running on PORT:', PORT);
});
