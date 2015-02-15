'use strict';

var model = module.exports;

model.getAccessToken = function (bearerToken, callback) {
    app.dbConnection.query(
        'SELECT access_token, account_id, expires, email FROM auth_tokens WHERE access_token = $1',
        [bearerToken],
        function (err, rows) {
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
};

model.getClient = function (accountId, clientSecret, callback) {
    app.dbConnection.query(
        'SELECT account_id, client_secret FROM oauth_clients WHERE account_id = $1', [accountId],
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
};

model.getRefreshToken = function (bearerToken, callback) {
    app.dbConnection.query(
        'SELECT refresh_token, account_id, expires, user_id FROM _refresh_tokens' +
            'WERE refresh_tokens = $1',
        [bearerToken],
        function (err, rows) {
            callback(err, rows.length > 0 ? rows[0] : false);
        }

    );
};

model.saveAccessToken = function (accessToken, clientId, expires, userId, callback) {
    app.dbConection.query(
        'INSERT INTO access_tokens(access_token, client_id, user_id, expires) ' +
            'VALUES ($1, $2, $3, $4)', [accessToken, clientId, userId, expires],
        function (err) {
            callback(err);
        }
    );
};

model.saveRefreshToken = function (refreshToken, clientId, expires, userId, callback) {
    app.dbConnection.query(
        'INSERT INTO oauth_refresh_tokens(refresh_token, client_id, user_id, ' +
            'expires) VALUES ($1, $2, $3, $4)',
        [refreshToken, clientId, userId, expires],
        function (err) {
            callback(err);
        }
    );
};

model.getUser = function (username, password, callback) {
    app.dbConnection.query(
        'SELECT id FROM users WHERE username = $1 AND password = $2',
        [username, password],
        function (err, rows) {
            callback(err, rows.length > 0 ? rows[0] : false);
        }
    );
};
