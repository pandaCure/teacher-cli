const { default: getTargets } = require('@babel/helper-compilation-targets')
const coreJsCompat = require('core-js-compat').data
const semver = require('semver')
let targets = getTargets()
const isHave = (targets, env) => {
  return semver.gt(semver.coerce(targets), semver.coerce(env))
}
// 根据填写的运行时环境推断需要的polyfill
const getNeedPolyfill = () => {
  return Object.keys(coreJsCompat).reduce((init, key) => {
    const env = coreJsCompat[key]
    for (let t in targets) {
      if (Object.hasOwnProperty.call(targets, t) && env[t] && isHave(targets[t], env[t])) {
        continue
      } else {
        init.push(key)
      }
    }
    return init
  }, [])
}
module.exports = {
  getNeedPolyfill
}
