/* global require:true, console: true */

'use strict';

var nconf = require('nconf'),
    express = require('express'),
    app = express(),
    mysql = require('mysql'),
    bodyParser = require('body-parser'),
    oauthserver = require('node-oauth2-server'),
    //session = require('express-session'),
    //MemoryStore = require('express-session').MemoryStore,
    serverPort,
    clients = [],
    dbConnectionObject;

nconf.argv()
    .env()
    .file({file: './app/config/settings.json'});

serverPort = nconf.get('server:port');

dbConnectionObject = {
    host: nconf.get('database:host'),
    user:  nconf.get('database:username'),
    password: nconf.get('database:password'),
    database: nconf.get('database:name')
};

app.dbConnection = mysql.createConnection(dbConnectionObject);

app.use(bodyParser.urlencoded({ extended: true }));

var oAuthModel = require('./oauth/model.js')(app, clients);

app.oauth = oauthserver({
    model: oAuthModel, // See below for specification
    grants: ['password'],
    debug: true
});

app.use(app.oauth.errorHandler());
app.all('/authorize', app.oauth.grant());

// Set server port
app.listen(serverPort);
console.log('server is running on port: ' + serverPort);
app.dbConnection.connect();

app.dbConnection.query('SELECT * FROM accounts', function(err, rows) {
    if (err) throw err;

    rows.forEach(function(row) {
        clients.push(row.id);
    });
});

//app.dbConnection.end();

