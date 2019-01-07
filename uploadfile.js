'use strict';

var config = require('./config.js');
var fetch = require('isomorphic-fetch');
var Dropbox = require('dropbox').Dropbox;

module.exports.uploadFile = function(newfile) {
  return new Promise((resolve, reject) => {
    const UPLOAD_FILE_SIZE_LIMIT = 150 * 1024 * 1024;
    var dbx = new Dropbox({ accessToken: config.ACCESS_TOKEN });
    var file = newfile;

    if (file.data.length < UPLOAD_FILE_SIZE_LIMIT) { // File is smaller than 150 Mb - use filesUpload API
      dbx.filesUpload({path: '/' + file.name, contents: file.data})
        .then(function(response) {
          resolve(response);
        })
        .catch(function(error) {
          console.error(error);
          reject(error);
        });
    } else {
      let msg = 'File must be lower than 150Mb';
      console.log(msg);
      reject(msg);
    }
  });
};