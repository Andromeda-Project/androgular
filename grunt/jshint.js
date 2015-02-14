module.exports = function(grunt, options) {
    'use strict';
    return {
        all: [
            'Gruntfile.js',
            'grunt/*.js',
            'apps/**/*.js'
        ]
    };
};
