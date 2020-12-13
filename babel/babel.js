module.exports = (context, options = {}) => {
  return {
    sourceType: 'unambiguous',
    presets: [
      [
        '@babel/preset-env',
        {
          useBuiltIns: 'entry',
          loose: false,
          debug: false,
          // useBuiltIns: 'usage',
          modules: false,
          bugfixes: true,
          corejs: require('core-js/package.json').version
        }
      ]
    ],
    plugins: [
      [
        '@babel/plugin-transform-runtime',
        {
          regenerator: true,
          corejs: false,
          helpers: true
        }
      ],
      [require('../a')]
    ]
  }
}
