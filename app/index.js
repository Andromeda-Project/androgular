/* global require:true, console: true */
(function() {
'use strict';

    var fs    = require('fs'),
        nconf = require('nconf'),
        express = require('express'),
        app = express(),
        mysql = require('mysql'),
        serverPort,
        dbConnectionObject,
        connection;

    nconf.argv()
        .env()
        .file({file: './app/config/settings.json'});

    serverPort = nconf.get('server:port');

    dbConnectionObject = {
        host: nconf.get('database:host'),
        user:  nconf.get('database:username'),
        password: nconf.get('database:password')
    };

    connection = mysql.createConnection(dbConnectionObject);

    // Set server port
    app.listen(serverPort);
    console.log('server is running on port: ' + serverPort);
    connection.connect();

    connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
      if (err) throw err;

      console.log('The solution is: ', rows[0].solution);
    });

    connection.end();
}());
