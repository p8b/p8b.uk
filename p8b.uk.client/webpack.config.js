const path = require("path");
const fs = require("fs");
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isDevelopment = false;
const outputPublicPath = "./build/public/";

const copyObjects = [
   {
      from: path.resolve(__dirname, "public/favicon.ico"),
      to: path.resolve(__dirname, `${outputPublicPath}`)
   },
   {
      from: path.resolve(__dirname, "public/manifest.json"),
      to: path.resolve(__dirname, `${outputPublicPath}`)
   },
   {
      from: path.resolve(__dirname, "public/styles"),
      to: path.resolve(__dirname, `${outputPublicPath}styles/`)
   },
   {
      from: path.resolve(__dirname, "public/images/"),
      to: path.resolve(__dirname, `${outputPublicPath}images/`)
   },
   {
      from: path.resolve(__dirname, "public/fonts/"),
      to: path.resolve(__dirname, `${outputPublicPath}fonts/`)
   },
   {
      from: path.resolve(__dirname, "public/docs/"),
      to: path.resolve(__dirname, `${outputPublicPath}docs/`)
   }
];
if (!isDevelopment)
   copyObjects.concat([
      {
         from: path.resolve(__dirname, "server/server-production.js"),
         to: path.resolve(__dirname, `./build`)
      },
      {
         from: path.resolve(__dirname, "server/cert/key.pem"),
         to: path.resolve(__dirname, `./build/cert/`)
      },
      {
         from: path.resolve(__dirname, "server/cert/cert.pem"),
         to: path.resolve(__dirname, `./build/cert/`)
      },
      {
         from: path.resolve(__dirname, "package.json"),
         to: path.resolve(__dirname, `./build`)
      },
   ]);

module.exports = {
   mode: isDevelopment ? "development" : "production",
   devtool: isDevelopment && "eval-source-map",
   entry: "./src/index.tsx",
   resolve: {
      extensions: [".js", ".tsx", ".css"]
   },
   output: {
      path: path.resolve(__dirname, "build"),
      filename: "public/js/p8b.[name].[hash].bundle.js",
      publicPath: "/",
   },
   module: {
      rules: [
         {
            test: /\.tsx?$/,
            loader: "babel-loader",
            //exclude: [/node_modules/]
         },
         {
            test: /\.s[ac]ss$/i,
            use: [
               isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
               "css-loader",
               "sass-loader",
            ],
         },
         {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
         },
      ]
   },
   devServer: {
      contentBase: path.join(__dirname, "build"),
      contentBasePublicPath: "public",
      compress: true,
      https: {
         key: fs.readFileSync('server/cert/key.pem'),
         cert: fs.readFileSync('server/cert/cert.pem')
      },
      port: 8080,
      open: true,
      openPage: "",
      //   host: "192.168.1.11",
      historyApiFallback: true,
   },
   plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
         filename: "public/styles/[name].css",
         chunkFilename: "[id].css",

      }),
      new HtmlWebPackPlugin({
         template: "./public/index.html",
         filename: "index.html",
         scriptLoading: "async",
      }),
      new CopyPlugin({
         patterns: copyObjects
      })
   ],
   externals: {
      "react": "React",
      "react-dom": "ReactDOM",
      "react-router": "ReactRouter",
      "react-router-dom": "ReactRouterDOM",
      "redux": "Redux",
      "react-redux": "ReactRedux",
      "redux-persist": "ReduxPersist",
      "redux-thunk": "ReduxThunk",
   },
   optimization: {
      minimize: true,
      minimizer: [new TerserPlugin({
         cache: true,
         parallel: true,
         terserOptions: {
            compress: {
               drop_console: true,
            }
         }
      })],
      splitChunks: {
         chunks: "all",
      },

   },
};