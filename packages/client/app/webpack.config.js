/* eslint-disable import/no-extraneous-dependencies */

const path = require('path')
const appRootPath = require('app-root-path')
const startsWith = require('lodash/startsWith')
const range = require('lodash/range')
const has = require('lodash/has')
const colors = require('colors/safe')

const webpack = require('webpack')
const CompressionPlugin = require('compression-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const {
  NODE_ENV,

  CLIENT_APP_ROOT_PATH,
  CLIENT_BUILD_FOLDER_PATH,
  CLIENT_ENTRY_FILE_PATH,
  CLIENT_FAST_REFRESH,
  CLIENT_FAVICON_PATH,
  CLIENT_PAGE_TITLE,
  CLIENT_STATIC_FOLDER_PATH,
  CLIENT_PAGES_FOLDER_PATH,
  CLIENT_PORT,
  CLIENT_UI_FOLDER_PATH,
  CLIENT_LANGUAGE,
  CLIENT_WS_MIN_TIMEOUT,
  CLIENT_WS_TIMEOUT,

  SERVER_URL,
  WEBSOCKET_SERVER_URL,
} = process.env

//
/* SET UP VARS */
//

// Environment variables that will only be used in this config
const variablesForWebpackConfig = [
  'CLIENT_APP_ROOT_PATH',
  'CLIENT_BUILD_FOLDER_PATH',
  'CLIENT_ENTRY_FILE_PATH',
  'CLIENT_FAST_REFRESH',
  'CLIENT_FAVICON_PATH',
  'CLIENT_LANGUAGE',
  'CLIENT_PAGE_TITLE',
  'CLIENT_PAGES_FOLDER_PATH',
  'CLIENT_PORT',
  'CLIENT_STATIC_FOLDER_PATH',
  'CLIENT_UI_FOLDER_PATH',
]

/**
 * This object maps variables to their default values
 * If a variable is undefined, an error will be thrown
 * Use undefined for required variables, and null or an actual value for optional ones
 * Server url and websocket url are optional because they might not be provided at build time in production,
 * but at runtime with our dynamic url mechanism
 */

const DEFAULT_CLIENT_WS_MIN_TIMEOUT = 5000
const DEFAULT_CLIENT_WS_TIMEOUT = 60000

// Environment variables that will be passed down to the build
const variablesForBuild = {
  NODE_ENV: undefined,
  SERVER_URL: null,
  WEBSOCKET_SERVER_URL: null,
  CLIENT_WS_MIN_TIMEOUT: DEFAULT_CLIENT_WS_MIN_TIMEOUT,
  CLIENT_WS_TIMEOUT: DEFAULT_CLIENT_WS_TIMEOUT,
}

// Allow custom variables that start with CLIENT_ to pass into the build
const customVariables = Object.keys(process.env)
  .filter(k => {
    return (
      !variablesForWebpackConfig.includes(k) &&
      !has(variablesForBuild, k) &&
      startsWith(k, 'CLIENT_')
    )
  })
  .reduce((obj, k) => {
    const newObj = { ...obj }
    newObj[k] = undefined
    return newObj
  }, {})

const variablesInBuild = { ...variablesForBuild, ...customVariables }

const mode = NODE_ENV === 'production' ? 'production' : 'development'
const isEnvDevelopment = mode === 'development'
const isEnvProduction = mode === 'production'

let appPath

if (CLIENT_APP_ROOT_PATH) {
  appPath = path.resolve(CLIENT_APP_ROOT_PATH)
} else {
  appPath = path.resolve(appRootPath.toString(), 'app')
}

const uiFolderPath = path.resolve(appPath, CLIENT_UI_FOLDER_PATH || 'ui')

const pagesFolderPath = path.resolve(
  appPath,
  CLIENT_PAGES_FOLDER_PATH || 'pages',
)

const noopPath = path.resolve(__dirname, 'noop.js')

const staticFolderPath =
  CLIENT_STATIC_FOLDER_PATH || path.resolve(appPath, '..', 'static')

const buildFolderPath =
  CLIENT_BUILD_FOLDER_PATH || path.resolve(appPath, '..', '_build')

// react's fast-refresh is opt-in for the time being
const fastRefreshValue =
  CLIENT_FAST_REFRESH && CLIENT_FAST_REFRESH.toString().toLowerCase()

const useFastRefresh = fastRefreshValue === '1' || fastRefreshValue === 'true'

const templatePath = path.resolve(__dirname, 'index.ejs')
const entryFilePath = CLIENT_ENTRY_FILE_PATH || './start.js'
const devServerPort = CLIENT_PORT || 8080
const faviconPath = CLIENT_FAVICON_PATH
const pageTitle = CLIENT_PAGE_TITLE
const language = CLIENT_LANGUAGE
const defaultLanguage = 'en-US'

const serverUrl = SERVER_URL
const websocketServerUrl = WEBSOCKET_SERVER_URL

const WSLinkMinTimeout = CLIENT_WS_MIN_TIMEOUT || DEFAULT_CLIENT_WS_MIN_TIMEOUT
const WSLinkTimeout = CLIENT_WS_TIMEOUT || DEFAULT_CLIENT_WS_TIMEOUT

// const antVariablesPath = require.resolve(
//   path.join(antPath, 'lib/style/themes/default.less'),
// )

// #region log-init
/* eslint-disable no-console */
const symbolGenerator = n => {
  const SYMBOL = '/'
  let symbols = ''
  range(n).forEach(() => (symbols += SYMBOL))
  return symbols
}

const cyan = t => console.log(colors.cyan(t))

const logSeparator = () => cyan(symbolGenerator(22))

const logHeader = text => {
  logSeparator()
  cyan(`${symbolGenerator(2)} ${text.toUpperCase()}\n`)
}

const logStatus = (label, message, newLine) => {
  console.log(`${colors.cyan(label)}: ${message}${newLine ? '\n' : ''}`)
}

logHeader('coko client info')
logStatus('Environment', NODE_ENV, true)
logStatus(`App context path is set to`, appPath)
isEnvProduction && logStatus(`Build will be written to`, buildFolderPath)
logStatus(`Static folder path found at`, staticFolderPath)
logStatus(`App entry file will be`, entryFilePath)
logStatus(`UI folder path will be`, uiFolderPath)
logStatus(`Pages folder path will be`, pagesFolderPath)
logStatus(`Favicon path will be`, faviconPath)
logStatus(`Page title set to`, pageTitle)
logStatus(`Language set to`, language || `${defaultLanguage} (default)`)
isEnvDevelopment && logStatus(`Dev server will run at port`, devServerPort)
logStatus(`Server will be requested at`, serverUrl)
logStatus(`Websocket server will be requested at`, websocketServerUrl)
logStatus(`Websocket link min timeout will be `, WSLinkMinTimeout)
logStatus(`Websocket link timeout will be `, WSLinkTimeout)
logStatus(`React fast-refresh is`, useFastRefresh ? 'on' : 'off')

logStatus(
  'Custom environment variables detected',
  customVariables.length > 0 ? `${customVariables}` : 'none',
  true,
)

logSeparator()
console.log('')
/* eslint-enable no-console */
// #endregion log-init

//
/* BASE CONFIG */
//

const webpackConfig = {
  context: appPath,
  entry: entryFilePath,
  name: 'client',
  mode,
  // TO D0 -- browserlist?
  target: 'web',

  // TO DO -- bundle analyzer
  // TO DO -- code splitting
  // TO DO -- hash is deprecated
  output: {
    chunkFilename: isEnvProduction
      ? 'js/[name].[hash:8].chunk.js'
      : isEnvDevelopment && 'js/[name].chunk.js',
    filename: isEnvProduction
      ? 'js/[name].[hash:8].js'
      : isEnvDevelopment && 'js/bundle.js',
    // There are also additional JS chunk files if you use code splitting.
    // path: contentBase,
    path: buildFolderPath,
    // publicPath: isEnvProduction ? '/assets/' : '/',
    publicPath: '/',
  },

  //
  /* RULES */
  //

  module: {
    rules: [
      // Typescript
      { test: /\.tsx?$/, loader: 'ts-loader' },

      // TO DELETE?
      // mjs files: needed because of apollo client??
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },

      // js files
      {
        test: /\.js$|\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: [
              // ['@babel/plugin-proposal-decorators', { version: '2023-11' }],
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              'babel-plugin-parameter-decorator',
              ['@babel/plugin-transform-class-properties', { loose: true }],
              [
                '@babel/plugin-transform-private-property-in-object',
                { loose: true },
              ],
              ['@babel/plugin-transform-private-methods', { loose: true }],
              '@babel/plugin-proposal-function-sent',
              '@babel/plugin-proposal-throw-expressions',
              '@babel/plugin-transform-runtime',
              'babel-plugin-styled-components',
            ].filter(Boolean),

            env: {
              development: {
                plugins: [
                  useFastRefresh && require.resolve('react-refresh/babel'),
                ].filter(Boolean),
              },
              // TO DO: install babel-preset-minify?
              //   production: {
              //     /* bug requires mangle:false https://github.com/babel/minify/issues/556#issuecomment-339751209 */
              //     presets: [['minify', { builtIns: false, mangle: false }]],
              //   },
            },
          },
        },
      },

      // TO DO -- remove url-loader from dependencies

      // Images
      {
        test: /\.png|\.jpg|\.svg$/,
        type: 'asset/resource',
      },
      // {
      //   test: /\.png|\.jpg$/,
      //   loader: 'url-loader',
      //   // options: {
      //   //   limit: 5000,
      //   // },
      // },

      // Fonts
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
      // {
      //   test: /\.woff|\.woff2|\.svg|.eot|\.ttf/,
      //   loader: 'url-loader',
      //   options: {
      //     name: 'static/media/[name].[hash:8].[ext]',
      //     // fonts break without this line, revisit when webpack dependencies are upgraded
      //     esModule: false,
      //   },
      // },

      // HTML
      { test: /\.html$/, loader: 'html-loader' },

      // CSS
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },

      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
          },
        ],
      },
    ],
  },

  //
  /* PLUGINS */
  //

  plugins: [
    // Use the index.ejs template to create the base index.html file of the bundle
    new HtmlWebpackPlugin({
      favicon: faviconPath,
      template: templatePath,
      title: pageTitle,
      language: language || defaultLanguage,
    }),

    // DEV-ONLY
    // React fast-refresh
    isEnvDevelopment &&
      useFastRefresh &&
      new webpack.HotModuleReplacementPlugin(),
    isEnvDevelopment && useFastRefresh && new ReactRefreshWebpackPlugin(),

    isEnvDevelopment &&
      new BundleAnalyzerPlugin({
        openAnalyzer: false,
        analyzerHost: '0.0.0.0',
      }),

    // PROD-ONLY
    isEnvProduction &&
      new MiniCssExtractPlugin({
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
        filename: 'static/css/[name].[contenthash:8].css',
      }),

    // Make sure environment variables are defined
    new webpack.EnvironmentPlugin(variablesInBuild),

    // Copy static assets to root of build folder
    new CopyPlugin({
      patterns: [{ from: staticFolderPath }],
    }),

    new webpack.optimize.AggressiveMergingPlugin(),
    new CompressionPlugin(),

    // TO DELETE
    // new webpack.NoEmitOnErrorsPlugin(),
    // new webpack.optimize.OccurrenceOrderPlugin(),
  ].filter(Boolean),

  // TO DELETE
  // resolve: {
  //   alias: {
  //     config: clientConfigPath,
  //     joi: 'joi-browser',
  //   },
  //   enforceExtension: false,
  //   extensions: ['.mjs', '.js', '.jsx', '.json', '.scss'],
  // },

  resolve: {
    alias: {
      pages: pagesFolderPath,
      ui: uiFolderPath,
    },
    fallback: {
      pages: noopPath,
      ui: noopPath,
    },
  },
}

if (isEnvDevelopment) {
  // TO DO -- use any source map in production?
  webpackConfig.devtool = 'cheap-module-source-map'

  //
  /* WEBPACK DEV SERVER */
  //

  webpackConfig.devServer = {
    // handle unknown routes
    historyApiFallback: true,
    // play nice from a within a docker container
    host: '0.0.0.0',
    port: devServerPort,
  }
}

module.exports = webpackConfig
