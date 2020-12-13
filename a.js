const { addSideEffect } = require('@babel/helper-module-imports')
module.exports = ({ types }, { polyfills, entryFiles = [], useAbsolutePath }) => {
  console.log(1)
  return {
    name: 'vue-cli-inject-polyfills',
    visitor: {
      Program(path, state) {
        if (!entryFiles.includes(state.filename)) {
          return
        }

        console.log()
        addSideEffect(path, 'regenerator-runtime/runtime')
      }
    }
  }
}
