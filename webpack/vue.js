const VueLoaderPlugin = require('vue-loader/lib/plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const hash = require('hash-sum')
const path = require('path')
const fs = require('fs')
const Module = require('module')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { delete } = require('vue/types/umd')
const node = {
  setImmediate: false,
  process: 'mock',
  dgram: 'empty',
  fs: 'empty',
  net: 'empty',
  tls: 'empty',
  child_process: 'empty'
}
const moduleFileExtensions = ['.mjs', '.js', '.jsx', '.vue', '.json', '.wasm']
// vueversion 2, 3
const alias = {
  // vue$: 'vue/dist/vue.runtime.esm-bundler.js',
  vue$: 'vue/dist/vue.runtime.esm.js' // version 2
}
const plugins = [
  new VueLoaderPlugin(),
  new ESLintPlugin({
    // Plugin options
    extensions: ['js', 'jsx', 'vue'],
    formatter: require.resolve('react-dev-utils/eslintFormatter'),
    eslintPath: require.resolve('eslint'),
    context: paths.appSrc, // src目录
    cache: true,
    cacheLocation: path.resolve(paths.appNodeModules, '.cache/.eslintcache'),
    // ESLint class options
    cwd: paths.appPath,
    resolvePluginsRelativeTo: __dirname,
    baseConfig: {
      extends: [require.resolve('eslint-config-react-app/base')]
    }
  })
]
const noParse = /^(vue|vue-router|vuex|vuex-router-sync)$/
// eslint-disable-next-line max-params
const genCacheConfig = (id = undefined, partialIdentifier = {}, configFiles = [], version = 2) => {
  let vueVersion = {}
  if (version === 2) {
    vueVersion = {
      'vue-loader': require('vue-loader/package.json').version,
      '@vue/component-compiler-utils': require('@vue/component-compiler-utils/package.json').version,
      'vue-template-compiler': require('vue-template-compiler/package.json').version
    }
  } else if (version === 3) {
    vueVersion = {
      'vue-loader': require('vue-loader-v16/package.json').version,
      '@vue/compiler-sfc': require('@vue/compiler-sfc/package.json').version
    }
  }
  const variables = {
    partialIdentifier,
    vueVersion,
    'cache-loader': require('cache-loader/package.json').version,
    env: process.env.NODE_ENV,
    configFiles: ['package-lock.json', 'yarn.lock']
  }
  const readConfig = (file) => {
    const absolutePath = path.resolve(process.cwd(), file)
    if (!fs.existsSync(absolutePath)) {
      return
    }

    if (absolutePath.endsWith('.js')) {
      // should evaluate config scripts to reflect environment variable changes
      try {
        return JSON.stringify(require(absolutePath))
      } catch (e) {
        return fs.readFileSync(absolutePath, 'utf-8')
      }
    } else {
      return fs.readFileSync(absolutePath, 'utf-8')
    }
  }
  // 解决window 换行符问题
  variables.configFiles = configFiles.map((file) => {
    const content = readConfig(file)
    return content && content.replace(/\r\n?/g, '\n')
  })
  const cacheIdentifier = hash(variables)
  return cacheIdentifier
}
const createRequire =
  Module.createRequire ||
  Module.createRequireFromPath ||
  function (filename) {
    const mod = new Module(filename, null)
    mod.filename = filename
    mod.paths = Module._nodeModulePaths(path.dirname(filename))

    mod._compile(`module.exports = require;`, filename)

    return mod.exports
  }
const getStyleLoaders = (env, shouldUseSourceMap, isCssModule) => {
  const isProduction = env === 'production'
  const isDevelopment = env === 'development'
  const cssLoaderOptions = {
    sourceMap: isProduction ? shouldUseSourceMap : isDevelopment,
    importLoaders: 2,
    modules: {}
  }
  if (isCssModule) {
    cssLoaderOptions.modules = {
      localIdentName: '[name]_[local]_[hash:base64:5]'
    }
  } else {
    delete cssLoaderOptions.modules
  }
  const loaders = [
    isDevelopment && {
      loader: require.resolve('vue-style-loader'),
      options: {
        sourceMap: isProduction ? shouldUseSourceMap : isDevelopment
      }
    },
    isProduction && {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: !isProduction
      }
      // options: paths.publicUrlOrPath.startsWith('.') ? { publicPath: '../../' } : {} // TODO:处理一下
    },
    {
      loader: require.resolve('css-loader'),
      options: cssLoaderOptions
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        sourceMap: shouldUseSourceMap,
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009'
            },
            stage: 3
          }),
          postcssNormalize()
        ],
        sourceMap: isProduction ? shouldUseSourceMap : isDevelopment
      }
    }
  ].filter(Boolean)
  return loaders
}
module.exports = {
  node,
  moduleFileExtensions,
  alias,
  plugins,
  noParse,
  genCacheConfig,
  createRequire,
  getStyleLoaders
}
