/* global require:true, console: true */

'use strict';

var nconf = require('nconf'),
    express = require('express'),
    fs = require('fs'),
    app = express(),
    mysql = require('mysql'),
    bodyParser = require('body-parser'),
    //session = require('express-session'),
    //MemoryStore = require('express-session').MemoryStore,
    serverPort,
    clients = [],
    anyDB = require('any-db'),
    dbConnectionConfig,
    dbConnectionString,
    env,
    confFile;


nconf.argv().env();
env = (nconf.get('NODE_ENV') || 'DEV').toLowerCase();

confFile = './app/config/settings_' + env + '.json';
fs.exists(confFile, function(exists) {
    if (!exists) {
        console.log('Configuration file not found for Environment: ', env);
        return;
    }
    console.log('Current Environment: ', env);
    nconf.file({file: confFile});

    serverPort = nconf.get('server:port');

    dbConnectionConfig = {
        host: nconf.get('database:host'),
        user:  nconf.get('database:username'),
        password: nconf.get('database:password'),
        database: nconf.get('database:name')
    };

    dbConnectionString = 'mysql://' + dbConnectionConfig.user + ':' + dbConnectionConfig.password + '@' +
        dbConnectionConfig.host + '/' + dbConnectionConfig.database;

        console.log(dbConnectionString);
    app.dbConnection = anyDB.createPool(dbConnectionString, {min: 2, max: 10});

    app.use(bodyParser.urlencoded({ extended: true }));

    app.use('/api/*', access());

    // Set server port
    app.listen(serverPort);
    console.log('server is running on port: ' + serverPort);

    app.dbConnection.query('SELECT * FROM accounts', function(err, rows) {
        if (err) throw err;

        rows.forEach(function(row) {
            clients.push(row.id);
        });
    });
});
