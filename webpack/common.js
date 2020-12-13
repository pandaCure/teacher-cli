const path = require('path')
const fs = require('fs')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const safePostCssParser = require('postcss-safe-parser')
const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')
const semver = require('semver')
const { genCacheConfig, getStyleLoaders } = require('./vue')
const isProduction = process.env.production
const isDevelopment = process.env.development
const mode = isDevelopment ? 'development' : isProduction ? 'production' : 'none'
const shouldUseSourceMap = false
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath)
// TODO: use createRequire方法
const vueVersion = semver.major(require(path.resolve(resolveApp('node_modules'), 'vue/package.json')).version)
const compress = {
  arrows: false,
  collapse_vars: false, // 0.3kb
  comparisons: false,
  computed_props: false,
  hoist_funs: false,
  hoist_props: false,
  hoist_vars: false,
  inline: false,
  loops: false,
  negate_iife: false,
  properties: false,
  reduce_funcs: false,
  reduce_vars: false,
  switches: false,
  toplevel: false,
  typeofs: false
}
const getWebpackCommonConfig = (runType, prefixOutput, dist) => {
  // TODO: 根据runType获取相应的配置
  // TODO: 获取输出目录
  const appBuildDist = path.resolve(dist)
  // TODO: merge user custom alias\
  // TODO: 变量控制加速
  const useSpeedUp = true
  // TODO: 读取本地文件
  const env = {
    stringified: {}
  }
  const appHtmlTemplatePath = ''
  const imageInlineSizeLimit = 10000 || 4096
  const transpileDepRegex = //
  return {
    mode,
    node: {},
    bail: isProduction,
    performance: false,
    devtool: isProduction ? (shouldUseSourceMap ? 'source-map' : false) : isDevelopment && 'cheap-module-source-map',
    output: {
      // TODO: [name].js
      filename: isProduction ? `static/js/[name].[contenthash:8].js` : isDevelopment && 'static/js/bundle.js',
      path: isProduction ? appBuildDist : undefined,
      publicPath: '',
      chunkFilename: '',
      pathinfo: isDevelopment,
      // web
      globalObject: 'this'
    },
    entry: 'xxxx.js',
    resolve: {
      extensions: [], // TODO:处理ts
      modules: ['node_modules', resolveApp('node_modules')],
      alias: {},
      plugins: [
        // TODO 是否控制组织从src下导入文件
      ]
    },
    resolveLoader: {},
    optimization: {
      minimize: isProduction,
      minimizer: [
        // This is only used in production mode
        new TerserPlugin({
          terserOptions: {
            // TODO use defalut 5?
            parse: {
              ecma: 8
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2
            },
            mangle: {
              safari10: true
            },
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true
            }
          },
          sourceMap: shouldUseSourceMap,
          cache: useSpeedUp,
          parallel: useSpeedUp,
          extractComments: false
        }),
        // This is only used in production mode
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            parser: safePostCssParser,
            map: shouldUseSourceMap
              ? {
                  inline: false,
                  annotation: true
                }
              : false
          },
          cssProcessorPluginOptions: {
            preset: ['default', { minifyFontValues: { removeQuotes: false } }]
          }
        })
      ],
      splitChunks: {
        chunks: 'all',
        name: isDevelopment
      },
      runtimeChunk: {
        name: (entrypoint) => `runtime-${entrypoint.name}`
      }
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: true,
        template: appHtmlTemplatePath,
        ...(isProduction
          ? {
              minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
              }
            }
          : undefined)
      }),
      new webpack.DefinePlugin(env.stringified),
      isDevelopment && new webpack.HotModuleReplacementPlugin(),
      isDevelopment && new CaseSensitivePathsPlugin(),
      isProduction &&
        new MiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          // both options are optional
          filename: 'static/css/[name].[contenthash:8].css',
          chunkFilename: 'static/css/[name].[contenthash:8].chunk.css'
        }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ].filter(Boolean),
    module: {
      // TODO: 替换各种版本 eg.jquery
      noParse: /^(vue|vue-router|vuex|vuex-router-sync)$/,
      strictExportPresence: true,
      rules: [
        {
          parser: { requireEnsure: false } // 使用规范语法
        },
        {
          oneOf: [
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: require.resolve('url-loader'),
              options: {
                limit: imageInlineSizeLimit,
                name: 'static/media/[name].[hash:8].[ext]' // TODO: 是否有必要fallback中的file-loader处理>imageInlineSizeLimit文件
              }
            },
            // TODO: vue
            // TODO: webpack 5 不使用cache-loader 用cache代替 是否更新 需要对比打包速度
            {
              test: /\.vue$/,
              use: [
                {
                  loader: require.resolve('cache-loader'),
                  options: {
                    cacheDirectory: path.resolve(resolveApp('node_modules'), '.cache/cache-loader'),
                    cacheIdentifier: genCacheConfig()
                  }
                },
                {
                  // 3 vue-loader-v16
                  loader: require.resolve('vue-loader'),
                  options: {
                    cacheDirectory: path.resolve(resolveApp('node_modules'), '.cache/vue-loader'),
                    cacheIdentifier: genCacheConfig(),
                    compilerOptions: {
                      whitespace: 'condense'
                    } // 2
                    // babelParserPlugins: ['jsx', 'classProperties', 'decorators-legacy'] // 3
                  }
                }
              ]
            },
            {
              test: /\.pug$/,
              oneOf: [
                {
                  resourceQuery: /vue/,
                  use: [{ loader: 'pug-plain-loader' }]
                },
                {
                  use: [
                    { loader: 'raw-loader' },
                    {
                      loader: 'pug-plain-loader'
                    }
                  ]
                }
              ]
            },
            {
              test: /\.css$/,
              oneOf: [
                {
                  // <style lang="module">
                  resourceQuery: /module/,
                  use: getStyleLoaders(undefined, true, true)
                },
                {
                  // <style>
                  resourceQuery: /\?vue/,
                  use: getStyleLoaders(undefined, true, false)
                },
                {
                  // *.module.* files
                  test: /\.module\.\w+$/,
                  use: getStyleLoaders(undefined, true, true)
                },
                {
                  // normal CSS imports
                  use: getStyleLoaders(undefined, true, false)
                }
              ]
            },
            {
              test: /\.p(ost)?css$/,
              oneOf: [
                {
                  // <style lang="module">
                  resourceQuery: /module/,
                  use: getStyleLoaders(undefined, true, true)
                },
                {
                  // <style>
                  resourceQuery: /\?vue/,
                  use: getStyleLoaders(undefined, true, false)
                },
                {
                  // *.module.* files
                  test: /\.module\.\w+$/,
                  use: getStyleLoaders(undefined, true, true)
                },
                {
                  // normal CSS imports
                  use: getStyleLoaders(undefined, true, false)
                }
              ]
            },
            {
              // 需要测试background-image: url是否正常
              // https://www.npmjs.com/package/resolve-url-loader
              test: /\.scss$/,
              oneOf: [
                {
                  // <style lang="module">
                  resourceQuery: /module/,
                  use: getStyleLoaders(undefined, true, true).concat({
                    loader: require.resolve('sass-loader'),
                    // TODO: dart-sass
                    // https://www.npmjs.com/package/sass-loader
                    options: {
                      sourceMap: true
                    }
                  })
                },
                {
                  // <style>
                  resourceQuery: /\?vue/,
                  use: getStyleLoaders(undefined, true, false).concat({
                    loader: require.resolve('sass-loader'),
                    options: {
                      sourceMap: true
                    }
                  })
                },
                {
                  // *.module.* files
                  test: /\.module\.\w+$/,
                  use: getStyleLoaders(undefined, true, true).concat({
                    loader: require.resolve('sass-loader'),
                    options: {
                      sourceMap: true
                    }
                  })
                },
                {
                  // normal CSS imports
                  use: getStyleLoaders(undefined, true, false).concat({
                    loader: require.resolve('sass-loader'),
                    options: {
                      sourceMap: true
                    }
                  })
                }
              ]
            },
            {
              test: /\.sass$/,
              oneOf: [
                {
                  // <style lang="module">
                  resourceQuery: /module/,
                  use: getStyleLoaders(undefined, true, true).concat({
                    loader: require.resolve('sass-loader'),
                    // TODO: dart-sass
                    // https://www.npmjs.com/package/sass-loader
                    options: {
                      sourceMap: true
                    }
                  })
                },
                {
                  // <style>
                  resourceQuery: /\?vue/,
                  use: getStyleLoaders(undefined, true, false).concat({
                    loader: require.resolve('sass-loader'),
                    options: {
                      sourceMap: true
                    }
                  })
                },
                {
                  // *.module.* files
                  test: /\.module\.\w+$/,
                  use: getStyleLoaders(undefined, true, true).concat({
                    loader: require.resolve('sass-loader'),
                    options: {
                      sourceMap: true
                    }
                  })
                },
                {
                  // normal CSS imports
                  use: getStyleLoaders(undefined, true, false).concat({
                    loader: require.resolve('sass-loader'),
                    options: {
                      sourceMap: true
                    }
                  })
                }
              ]
            },
            {
              test: /\.less$/,
              oneOf: [
                {
                  // <style lang="module">
                  resourceQuery: /module/,
                  use: getStyleLoaders(undefined, true, true).concat({
                    loader: require.resolve('less-loader'),
                    // TODO: dart-sass
                    // https://www.npmjs.com/package/sass-loader
                    options: {
                      sourceMap: true
                    }
                  })
                },
                {
                  // <style>
                  resourceQuery: /\?vue/,
                  use: getStyleLoaders(undefined, true, false).concat({
                    loader: require.resolve('less-loader'),
                    options: {
                      sourceMap: true
                    }
                  })
                },
                {
                  // *.module.* files
                  test: /\.module\.\w+$/,
                  use: getStyleLoaders(undefined, true, true).concat({
                    loader: require.resolve('less-loader'),
                    options: {
                      sourceMap: true
                    }
                  })
                },
                {
                  // normal CSS imports
                  use: getStyleLoaders(undefined, true, false).concat({
                    loader: require.resolve('less-loader'),
                    options: {
                      sourceMap: true
                    }
                  })
                }
              ]
            },
            {
              test: /\.styl(us)?$/,
              oneOf: [
                {
                  // <style lang="module">
                  resourceQuery: /module/,
                  use: getStyleLoaders(undefined, true, true).concat({
                    loader: require.resolve('stylus-loader'),
                    options: {
                      sourceMap: true,
                      preferPathResolver: 'webpack'
                    }
                  })
                },
                {
                  // <style>
                  resourceQuery: /\?vue/,
                  use: getStyleLoaders(undefined, true, false).concat({
                    loader: require.resolve('stylus-loader'),
                    options: {
                      sourceMap: true,
                      preferPathResolver: 'webpack'
                    }
                  })
                },
                {
                  // *.module.* files
                  test: /\.module\.\w+$/,
                  use: getStyleLoaders(undefined, true, true).concat({
                    loader: require.resolve('stylus-loader'),
                    options: {
                      sourceMap: true,
                      preferPathResolver: 'webpack'
                    }
                  })
                },
                {
                  // normal CSS imports
                  use: getStyleLoaders(undefined, true, false).concat({
                    loader: require.resolve('stylus-loader'),
                    options: {
                      sourceMap: true,
                      preferPathResolver: 'webpack'
                    }
                  })
                }
              ]
            },
            {
              // TODO：和react统一配置
              test: /\.m?jsx?$/,
              exclude: [
                function (filepath) {
                  if (/\.vue\.jsx?$/.test(filepath)) {
                    return false
                  }
                  // TODO: 注意babel配置
                  // 貌似@babel/runtime有一些不符合当前配置的语法 需要再次转换
                  if (
                    filepath.includes(path.join('@babel', 'runtime'))
                  ) {
                    return false
                  }
                  // TODO：需要转换node_modules
                  if (transpileDepRegex && transpileDepRegex.test(filepath)) {
                    return false
                  }
                  return /node_modules/.test(filepath)
                }
              ],
              use: [
                {
                  loader: require.resolve('cache-loader'),
                  options: {
                    cacheDirectory: path.resolve(resolveApp('node_modules'), '.cache/cache-loader'),
                    // 增加babel.config.js 和 browList文件
                    cacheIdentifier: genCacheConfig()
                  }
                },
                {
                  loader: require.resolve('thread-loader')
                },
                {
                  loader: require.resolve('babel-loader')
                }
              ]
            },
            // TODO: react
            {
              // svg, webp, mp4|webm|ogg|mp3|wav|flac|aac woff2?|eot|ttf|otf以及一些未知文件 最后兜底
              loader: require.resolve('file-loader'),
              exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              options: {
                name: 'static/media/[name].[hash:8].[ext]'
              }
            }
          ]
        }
      ]
    }
  }
}
module.exports = {
  getWebpackCommonConfig
}
