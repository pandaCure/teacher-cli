const ESLintPlugin = require('eslint-webpack-plugin')
const node = {
  module: 'empty',
  dgram: 'empty',
  dns: 'mock',
  fs: 'empty',
  http2: 'empty',
  net: 'empty',
  tls: 'empty',
  child_process: 'empty'
}
const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx'
]
const plugins = [
  new ESLintPlugin({
    // Plugin options
    extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
    formatter: require.resolve('react-dev-utils/eslintFormatter'),
    eslintPath: require.resolve('eslint'),
    context: paths.appSrc, // src目录
    cache: true,
    cacheLocation: path.resolve(paths.appNodeModules, '.cache/.eslintcache'),
    // ESLint class options
    cwd: paths.appPath,
    resolvePluginsRelativeTo: __dirname,
    baseConfig: {
      extends: [require.resolve('eslint-config-react-app/base')],
      rules: {
        ...(!hasJsxRuntime && {
          'react/react-in-jsx-scope': 'error'
        })
      }
    }
  })
]
const loader = [{}]
module.exports = {
  node,
  moduleFileExtensions,
  plugins
}
