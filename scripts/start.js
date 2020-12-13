const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const { getWebpackConfig } = require('../config/webpack.config')
const { getEntryPageDetail } = require('../cli')
process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'

process.on('unhandledRejection', (err) => {
  throw err
})

const compilerVueProject = async (entryPage) => {
  // TODO: 将入口文件注入process.env.TARGET_ENTRY_CONFIg
  const compiler = webpack(getWebpackConfig(process.env.NODE_ENV, entryPage))
  const serverConfig = {}
  const devServer = new WebpackDevServer(compiler, serverConfig)
  devServer.listen(8888, '127.0.0.1', (err) => {
    if (err) {
      return console.log(err)
    }
  })
}
const startDevComplier = async () => {
  const entryPage = await getEntryPageDetail()
  if (entryPage) {
    await compilerVueProject(entryPage)
  }
}
startDevComplier()
