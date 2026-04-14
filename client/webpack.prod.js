const path = require("path");
const { merge } = require("webpack-merge");
const webpackConfig = require("./webpack.config");

module.exports = merge(webpackConfig, {
    mode: "production",
    output: {
        path: path.join(__dirname, "build"),
        filename: "[name].[contenthash:8].js",
        clean: true
    }
})