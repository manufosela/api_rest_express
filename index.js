const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const mongodb = require('mongodb');
const uploadFile = require('./uploadfile.js').uploadFile;

const config = {
  DB: 'mongodb://mongo:27017'
};
const optiondDB = {
  useNewUrlParser: true
};

const PORT = 3001;
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

app.get('/misdatos', function(req, res) {
  let data = dbo.collection('micoleccion').find({}).toArray((err, result) => {
    if (err) {
      throw err;
    }
    res.json(result);
  });
});

app.post('/uploadfile', function(req, res) {
  if (Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  let newFile = req.files.newfile;

  async function result(newFile) {
    let result = await uploadFile(newFile);
    return result;
  };

  result(newFile).then(result => {
    console.log(result);
    res.send('File ' + newFile.name + '(' + newFile.data.length / 1024 + 'Kb) uploaded!');
    dbo.collection('micoleccion').insert({titulo: newFile.name})
  }).catch(err => {
    console.log(err);
    return res.status(500).send('upload error');
  });
});

app.listen(PORT, function() {
  console.log('Your node js server is running on PORT:', PORT);
});
