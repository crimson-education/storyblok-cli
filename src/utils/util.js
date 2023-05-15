const chalk = require('chalk')

exports.bgYellow = (msg) => {
  console.warn(`  - ${chalk.bgYellow(`warning--- ${msg}`)}`)
}

exports.bgGreen = (msg) => {
  console.log(`  - ${chalk.bgGreen(`info--- ${msg}`)}`)
}
