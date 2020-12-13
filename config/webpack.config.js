const path = require('path')
const paths = require('./paths')
const appPackageJson = require(paths.appPackageJson)
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false'
const ESLintPlugin = require('eslint-webpack-plugin')
const getWebpackConfig = (webpackEnv, entry) => {
  const isEnvDevelopment = webpackEnv === 'development'
  const isEnvProduction = webpackEnv === 'production'
  const canUseEntry = Object.keys(entry).reduce((init, keys) => {
    const assignObj = {
      ...init,
      [keys]: path.resolve(paths.appSrc, entry[keys])
    }
    return assignObj
  }, {})
  return {
    entry: canUseEntry,
    mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
    bail: isEnvProduction,
    devtool: isEnvProduction
      ? shouldUseSourceMap
        ? 'source-map'
        : false
      : isEnvDevelopment && 'cheap-module-source-map',
    output: {
      path: isEnvProduction ? paths.appBuild : undefined,
      pathinfo: isEnvDevelopment,
      filename: isEnvProduction ? 'static/js/[name].[contenthash:8].js' : isEnvDevelopment && 'static/js/bundle.js',
      chunkFilename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].chunk.js'
        : isEnvDevelopment && 'static/js/[name].chunk.js',
      // publicPath: paths.publicUrlOrPath,
      // Point sourcemap entries to original disk location (format as URL on Windows)
      devtoolModuleFilenameTemplate: isEnvProduction
        ? (info) => path.relative(paths.appSrc, info.absoluteResourcePath).replace(/\\/g, '/')
        : isEnvDevelopment && ((info) => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')),
      globalObject: 'this'
    },
    module: {
      strictExportPresence: true,
      rules: [
        { parser: { requireEnsure: false } },
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          enforce: 'pre',
          use: [
            {
              options: {
                cache: true,
                formatter: require.resolve('eslint/lib/cli-engine/formatters/codeframe'), // 处理eslint报错
                eslintPath: require.resolve('eslint')
              },
              loader: require.resolve('eslint-loader')
            }
          ],
          include: paths.appSrc
        },
        {
          oneOf: [
            {
              test: /\.(js|mjs|jsx|ts|tsx)$/,
              include: paths.appSrc,
              loader: require.resolve('babel-loader'),
              options: {
                // This is a feature of `babel-loader` for webpack (not Babel itself).
                // It enables caching results in ./node_modules/.cache/babel-loader/
                // directory for faster rebuilds.
                cacheDirectory: true,
                // See #6846 for context on why cacheCompression is disabled
                cacheCompression: false,
                compact: isEnvProduction
              }
            },
            // Process any JS outside of the app with Babel.
            // Unlike the application JS, we only compile the standard ES features.
            {
              test: /\.(js|mjs)$/,
              exclude: /@babel(?:\/|\\{1,2})runtime/,
              loader: require.resolve('babel-loader'),
              options: {
                babelrc: false,
                configFile: false,
                compact: false,
                presets: [
                  [
                    {
                      sourceType: 'unambiguous',
                      presets: [
                        (isEnvProduction || isEnvDevelopment) && [
                          require('@babel/preset-env').default,
                          {
                            useBuiltIns: 'entry',
                            corejs: 3,
                            exclude: ['transform-typeof-symbol']
                          }
                        ]
                      ].filter(Boolean),
                      plugins: [
                        [
                          require('@babel/plugin-transform-runtime').default,
                          {
                            corejs: false,
                            helpers: true,
                            version: require('@babel/runtime/package.json').version,
                            regenerator: true,
                            useESModules: isEnvDevelopment || isEnvProduction,
                            absoluteRuntime: path.dirname(require.resolve('@babel/runtime/package.json'))
                          }
                        ]
                      ].filter(Boolean)
                    },
                    { helpers: true }
                  ]
                ],
                cacheDirectory: true,
                // See #6846 for context on why cacheCompression is disabled
                cacheCompression: false,

                // Babel sourcemaps are needed for debugging into node_modules
                // code.  Without the options below, debuggers like VSCode
                // show incorrect code and set breakpoints on the wrong lines.
                sourceMaps: shouldUseSourceMap,
                inputSourceMap: shouldUseSourceMap
              }
            }
          ]
        },
        {
          test: /\.vue$/,
          use: [
            {
              loader: 'cache-loader',
              options: {}
            },
            {
              loader: 'vue-loader',
              options: {
                compilerOptions: {
                  whitespace: 'condense'
                }
              }
            }
          ]
        }
      ]
    },
    plugins: [new ESLintPlugin({})]
  }
}
module.exports = {
  getWebpackConfig
}
