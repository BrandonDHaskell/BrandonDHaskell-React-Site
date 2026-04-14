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
        host: "0.0.0.0",
        port: 3000,
        allowedHosts: "all",
        open: true,
        hot: true,
        client: {
            webSocketURL: "ws://localhost:8080/ws"
        }
    }
});