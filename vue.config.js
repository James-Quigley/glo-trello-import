const path = require('path');

module.exports = {
    baseUrl: process.env.NODE_ENV === 'production' ?
        '/glo-trello-import/' : '/',
    outputDir: path.resolve(__dirname, "./docs"),
    configureWebpack: {
        devtool: 'source-map',
    }
}