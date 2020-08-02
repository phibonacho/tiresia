const path = require('path');

const {ProvidePlugin} = require("webpack");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPkgJsonPlugin = require("copy-pkg-json-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const {VueLoaderPlugin} = require("vue-loader");
module.exports = {
    entry : {
        index : './index.js',
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: "./",
        filename: "js/[name].js"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".vue"],
        alias: {
            vue: 'vue/dist/vue.js'
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        presets: [["@babel/preset-env", {modules: false}]],
                        plugins: ["@babel/plugin-syntax-dynamic-import"],
                    }
                }
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            // compilazione dei scss, immagini e font:
            {
                test: /_component\.(html)$/,
                use: {
                    loader: 'html-loader',
                    options: {
                        attrs: [':data-src']
                    }
                }
            },
            {
                test: /\.s?css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            url : (url)=> url.match(/\.(woff|woff2|eot|ttf|otf)$/),
                            importLoaders: 2,
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [
                                require('autoprefixer')(),
                            ],
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: 'img/[name].[ext]'
                    }
                }
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader'
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: 'fonts/[name].[ext]'
                    }
                }
            },
            { // VUE-LOADER: new rule in module section for VUE module
                test: /\.vue$/,
                loader: 'vue-loader'
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new VueLoaderPlugin(),
        new ProvidePlugin({
            Vue : 'vue'
        }),
        new HtmlWebpackPlugin({
            title: "Tiresia",
            template: "template/index.html",
            filename : "index.html",
            chunks: ['index'],
            inject: 'body',
            // inlineSource : '.(js|css)$'
        }),
        new MiniCssExtractPlugin({
            filename : `css/[name].css`
        }),
        new CopyPkgJsonPlugin({
            remove: ['devDependencies'],
        })
    ],
    stats : true,
    optimization: {
        splitChunks: {
            minSize: 1,
            cacheGroups: {
                js: {
                    test: /\.js$/,
                    name: "common",
                    chunks: "all",
                    minChunks: 2,
                },
                css: {
                    test: /\.s?css$/,
                    name: "common",
                    chunks: "all",
                    minChunks: 2,
                },
            }
        }
    }
};
