const semver = require('semver')
const vueJSXSpecial = (options, presets, plugins) => {
  let jsxOptions = {}
  if (typeof options.jsx === 'object') {
    jsxOptions = options.jsx
  }

  let vueVersion = 2
  try {
    const Vue = require('vue')
    vueVersion = semver.major(Vue.version)
  } catch (e) {}

  if (vueVersion === 2) {
    presets.push([require('@vue/babel-preset-jsx'), jsxOptions])
  } else if (vueVersion === 3) {
    plugins.push([require('@vue/babel-plugin-jsx'), jsxOptions])
  }
}
const vueDefaultPolyfill = [
  // promise polyfill alone doesn't work in IE,
  // needs this as well. see: #1642
  'es.array.iterator',
  // this is required for webpack code splitting, vuex etc.
  'es.promise',
  // this is needed for object rest spread support in templates
  // as vue-template-es2015-compiler 1.8+ compiles it to Object.assign() calls.
  'es.object.assign',
  // #2012 es.promise replaces native Promise in FF and causes missing finally
  'es.promise.finally'
]
module.exports = {
  vueJSXSpecial,
  vueDefaultPolyfill
}
