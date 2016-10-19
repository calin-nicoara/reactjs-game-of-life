var HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');


var HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
   template: __dirname + '/app/index.html',
    filename: 'index.html',
    inject: 'body'
});

module.exports = {
    entry: [
        'webpack-dev-server/client?http://localhost:8989',
        './app/index.js'
    ],
    output: {
        path: __dirname + '/dist',
        filename: "index_bundle.js"
    },
    module: {
        loaders: [
            {test: /\.js$/, include: __dirname + '/app', loader: 'babel-loader'},
            {test: /\.css$/, loader: "style-loader!css-loader"},
            {test: /\.sass$/, loader: "style-loader!css-loader!sass-loader"}
        ]
    },
    plugins: [HtmlWebpackPluginConfig],
    resolve: {
      extensions: ['', '.js', '.sass'],
      root: [path.join(__dirname, './app')]
    }
};