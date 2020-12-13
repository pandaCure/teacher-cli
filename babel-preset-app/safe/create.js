// 尽量使用ES5去编写
const path = require('path')
const { vueJSXSpecial, vueDefaultPolyfill } = require('./vue')
const runtimePath = path.dirname(require.resolve('@babel/runtime/package.json'))
const runtimeVersion = require('@babel/runtime/package.json').version
const { default: getTargets, isRequired } = require('@babel/helper-compilation-targets')
// 获取合法的polyfill
function getPolyfills(targets, includes) {
  // if no targets specified, include all default polyfills
  if (!targets || !Object.keys(targets).length) {
    return includes
  }

  const compatData = require('core-js-compat').data
  return includes.filter((item) => {
    if (!compatData[item]) {
      throw new Error(
        `Cannot find polyfill ${item}, please refer to 'core-js-compat' for a complete list of available modules`
      )
    }

    return isRequired(item, targets, { compatData })
  })
}
// eslint-disable-next-line complexity
module.exports = function (context, options = {}) {
  const presets = []
  const plugins = []
  const runType = options.runType
  if (runType === 'vue' && options.jsx !== false) {
    vueJSXSpecial(options, presets, plugins)
  }
  // TODO：动态获取文件
  const defaultEntryFiles = JSON.parse(process.env.TARGET_ENTRY_CONFIG || '[]')
  const {
    polyfills: userPolyfills,
    loose = false,
    debug = false,
    useBuiltIns = 'usage',
    modules = false,
    bugfixes = true,
    targets: rawTargets,
    spec,
    ignoreBrowserslistConfig,
    configPath,
    include,
    exclude,
    shippedProposals,
    forceAllTransforms,
    decoratorsBeforeExport,
    decoratorsLegacy,
    entryFiles = defaultEntryFiles,

    absoluteRuntime = runtimePath,
    version = runtimeVersion
  } = options
  // 获取运行时环境
  let targets = getTargets(rawTargets, { ignoreBrowserslistConfig, configPath })
  if (process.env.NODE_ENV === 'test') {
    targets = { node: 'current' }
  }
  let polyfills
  if (useBuiltIns === 'usage' && process.env.NODE_ENV === 'test') {
    const defaultPolyfill = runType === 'vue' ? vueDefaultPolyfill : runType === 'react' ? '' : undefined
    polyfills = getPolyfills(targets, userPolyfills || defaultPolyfill)
    plugins.push([require('../injectPolyfillsPlugin'), { polyfills, entryFiles, useAbsolutePath: !!absoluteRuntime }])
  } else {
    polyfills = []
  }

  const envOptions = {
    bugfixes,
    corejs: useBuiltIns ? require('core-js/package.json').version : false,
    spec,
    loose,
    debug,
    modules,
    targets,
    useBuiltIns,
    ignoreBrowserslistConfig,
    configPath,
    include,
    exclude: polyfills.concat(exclude || []),
    shippedProposals,
    forceAllTransforms
  }
  // cli-plugin-jest sets this to true because Jest runs without bundling
  if (process.env.VUE_CLI_BABEL_TRANSPILE_MODULES) {
    envOptions.modules = 'commonjs'
    if (process.env.VUE_CLI_BABEL_TARGET_NODE) {
      // necessary for dynamic import to work in tests
      plugins.push(require('babel-plugin-dynamic-import-node'))
    }
  }
  presets.unshift([require('@babel/preset-env'), envOptions])
  if (runType === 'react') {
    presets.push([
      require('@babel/preset-react').default,
      {
        // Adds component stack to warning messages
        // Adds __self attribute to JSX which React will use for some warnings
        development: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test',
        // Will use the native built-in instead of trying to polyfill
        // behavior for any plugins that require one.
        ...(options.runtime !== 'automatic' ? { useBuiltIns: true } : {}),
        runtime: options.runtime || 'classic'
      }
    ])
  }
  plugins.push(
    require('@babel/plugin-syntax-dynamic-import'),
    [
      require('@babel/plugin-proposal-decorators'),
      {
        decoratorsBeforeExport,
        legacy: decoratorsLegacy !== false
      }
    ],
    [require('@babel/plugin-proposal-class-properties'), { loose }],
    require('@babel/plugin-proposal-numeric-separator').default,
    require('@babel/plugin-proposal-optional-chaining').default,
    require('@babel/plugin-proposal-nullish-coalescing-operator').default
  )
  if (runType === 'react') {
    plugins.push([require('@babel/plugin-transform-flow-strip-types').default, false])
    if (process.env.NODE_ENV === 'production') {
      plugins.push([
        // Remove PropTypes from production build
        require('babel-plugin-transform-react-remove-prop-types').default,
        {
          removeImport: true
        }
      ])
    }
  }
  plugins.push([
    require('@babel/plugin-transform-runtime'),
    {
      regenerator: useBuiltIns !== 'usage',

      // polyfills are injected by preset-env & polyfillsPlugin, so no need to add them again
      corejs: false,

      helpers: useBuiltIns === 'usage',
      useESModules: !process.env.VUE_CLI_BABEL_TRANSPILE_MODULES,

      absoluteRuntime,

      version
    }
  ])

  return {
    sourceType: 'unambiguous',
    overrides: [
      {
        exclude: [/@babel[\/|\\\\]runtime/, /core-js/],
        presets,
        plugins
      },
      {
        // there are some untranspiled code in @babel/runtime
        // https://github.com/babel/babel/issues/9903
        include: [/@babel[\/|\\\\]runtime/],
        presets: [[require('@babel/preset-env'), envOptions]]
      },
      runType === 'react' && {
        exclude: /\.tsx?$/,
        plugins: [require('@babel/plugin-transform-flow-strip-types').default]
      }
    ].filter(Boolean)
  }
}
