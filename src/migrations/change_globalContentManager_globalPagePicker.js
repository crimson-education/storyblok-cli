const chalk = require('chalk')

module.exports = function (block, fullSlug) {
  // console.log(block?.globalPagePicker?.selectedPages)
  const gcmSelectedPages = block?.globalPagePicker?.selectedPages;
  if (!gcmSelectedPages) {
    console.log(chalk.bgRed(`ERROR: Error data found in ${fullSlug}`))
    return
  }

  // console.log(`Selected pages: ${gcmSelectedPages.length}`)

  block.globalPagePicker.selectedPages = gcmSelectedPages.map( (page) => {
    const { fullSlug } = page;
    if (!fullSlug.startsWith('en/blog/')
        || fullSlug.startsWith('en/blog/dynamic-ctas')
        || fullSlug.startsWith('en/blog/categories')
        || fullSlug.startsWith('en/blog/authors')
       ) {
      console.log(chalk.yellow(`Skipping non-blog pages: ${fullSlug}`))
      return page;
    }

    const segments = fullSlug.split('/')

    if (segments.length == 3) {
      console.log(chalk.yellow(`Skipping top level blog pages: ${fullSlug}`))
      return page;
    }

    const relocatedSlug = `en/blog/${segments[segments.length - 1]}`
    console.log(chalk.green(`Updating ${fullSlug} -> ${relocatedSlug}`))

    return {
      ...page,
      fullSlug: relocatedSlug
    }
  });
}

// const transformSlug = (fullSlug) => {
//   const segments = fullSlug.split('/')
//   return `en/blog/${segments[segments.length - 1]}`
// }
