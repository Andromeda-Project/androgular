module.exports = {
    all: {
        src: [
            './grunt/*.js',
            './Gruntfile.js',
            './app/**/*.js'
        ],
        options: {
            config: './.jscsrc',
            reporter: 'console'
        }
    }
};
