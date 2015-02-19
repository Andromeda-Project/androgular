'use strict';

module.exports = function (_app, _clients) {
    var app = _app,
    model,
    clients = _clients;

    model = {
        getAccessToken: function (bearerToken, callback) {
            app.dbConnection.query(
                'SELECT access_token, account_id, expires, email FROM auth_tokens WHERE access_token = ?',
                [bearerToken],
                function (err, rows) {
                    console.log(err);
                    console.log(rows);
                    if (err) {
                        return callback(err);
                    }

                    var token = rows[0];
                    callback(null, {
                        accessToken: token.acess_token,
                        clientId: token.account_id,
                        expires: token.expires,
                        userId: token.email
                    });

                }
            );
        },
        getClient: function (accountId, clientSecret, callback) {
            app.dbConnection.query(
                'SELECT account_id, client_secret FROM oauth_clients WHERE account_id = ?', [accountId],
                function (err, rows) {
                    if (err) {
                        return callback(err);
                    }

                    var client = rows[0];
                    if (clientSecret !== null && client.client_secret !== clientSecret) {
                        return callback();
                    }

                    callback(null, {
                        clientId: client.account_id,
                        clientSecret: client.client_secret
                    });
                }
            );
        },
        getRefreshToken: function (bearerToken, callback) {
            app.dbConnection.query(
                'SELECT refresh_token, account_id, expires, user_id FROM _refresh_tokens' +
                    'WERE refresh_tokens = ?',
                [bearerToken],
                function (err, rows) {
                    console.log(err);
                    callback(err, rows.length > 0 ? rows[0] : false);
                }

            );
        },
        saveAccessToken: function (accessToken, clientId, expires, userId, callback) {
            app.dbConnection.query(
                'INSERT INTO access_tokens(access_token, client_id, user_id, expires) ' +
                    'VALUES (?, ?, ?, ?)', [accessToken, clientId, userId.id, expires],
                function (err) {
                    callback(err);
                }
            );
        },
        saveRefreshToken: function (refreshToken, clientId, expires, userId, callback) {
            app.dbConnection.query(
                'INSERT INTO oauth_refresh_tokens(refresh_token, client_id, user_id, ' +
                    'expires) VALUES (?, ?, ?, ?)',
                [refreshToken, clientId, userId, expires],
                function (err) {
                    callback(err);
                }
            );
        },
        getUser: function (username, password, callback) {
            app.dbConnection.query(
                'SELECT id FROM users WHERE email = ? AND password = md5(?)',
                [username, password],
                function (err, rows) {
                    console.log('Result', rows);
                    callback(err, (rows ? rows[0] : false));
                }
            );
        },
        grantTypeAllowed: function (clientId, grantType, callback) {
            if (grantType === 'password') {
                return callback(false, clients.indexOf(clientId.toLowerCase()) >= 0);
            }

            callback(false, true);
        }
    };

    return model;
};
