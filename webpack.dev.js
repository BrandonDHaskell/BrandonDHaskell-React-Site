const path = require("path");
const { merge } = require("webpack-merge");
const webpackConfig = require("./webpack.config");

module.exports = merge(webpackConfig, {
    mode: "development",
    entry: "./src/index.tsx",
    devServer: {
        static: [
            {
                directory: path.join(__dirname, "public"),
                publicPath: "/"
            },
            {
                directory: path.join(__dirname, "dist")
            }
        ],
        compress: true,
        port: 3000,
        open: true,
        hot: true
    }
});