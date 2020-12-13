const inquirer = require('inquirer')
const chalk = require('chalk')
const { multiplePageConfig, IMultiplePageConfigProp } = require('./page-config')
const multiplePageChooseItem = Object.keys(multiplePageConfig).map((page) => {
  return {
    name: multiplePageConfig[page].pageName,
    value: multiplePageConfig[page].pagePath
  }
})
const getEntryPageDetail = async () => {
  const { action } = await inquirer.prompt([
    {
      name: 'action',
      type: 'checkbox',
      message: `请选择要编译的页面：`,
      choices: multiplePageChooseItem
    }
  ])
  return action
}
module.exports = {
  getEntryPageDetail
}
