const chalk = require('chalk')
const { isEmpty, cloneDeep, isEqual } = require('lodash')
const { parseError } = require('../utils')

const getStoriesByParams = async (api, params = {}) => {
  try {
    const stories = await api.getStories({
      ...params
    })
    console.log(`Stories returned: ${stories.length}`)

    return stories
  } catch (e) {
    const error = parseError(e)
    console.error(`${chalk.red('X')} An error ocurred when load the stories : ${error.message}`)

    return Promise.reject(error.error)
  }
}
const doneLocales = [
  'en',
  'ge',
  'ph-en',
  'varun-test',
  'la-es',
  'la-en',
  'az-az',
  'az-ru',
  'page-templates',
  'global-education-summit-sydney-22',
  'crimson-careers',
  'mx',
  'id',
  'id-en',
  'ca-zh',
  'hk-zh',
  'kr-en',
  'kz-en',
  'tr-en',
  'ru-en',
  'in',
  'hk-en',
  'mm-en',
  'kh-en',
  'th-en',
  'tw-en',
  'us-zh',
  'ae',
  'jp-en',
  'ja',
  'tr',
  'th',
  'vn-en',
  'vn',
  'ae-en',
  'us',
  'uk',
  'tw',
  'kr',
  'br',
  'ca'
]

const runWeb559 = async (api, options = {}) => {
  try {
    console.log(`${chalk.blue('-')} Getting all top level folders`)
    const folderParams = {
      folder_only: true,
      with_parent: 0,
      // per_page: 5,
      // starts_with: 'la-es',
      // starts_with: 'ca',
      starts_with: 'br',
    }
    const localeFolders = await getStoriesByParams(api, folderParams)

    if (isEmpty(localeFolders)) {
      console.log(`${chalk.blue('-')} There are no child folders of 0!`)
      return Promise.resolve({
        executed: false,
        motive: 'NO_FOLDERS'
      })
    }
    console.log(`===${localeFolders.length}`)
    for (const locale of localeFolders) {
      console.log(`====${locale.full_slug}`)
      // if (doneLocales.includes(locale.full_slug)) {
      //   console.log(`${chalk.bgYellow(`Locale ${locale.full_slug} has been processed. Moving to the next one`)} `)
      //   continue
      // }

      // get blog folder itself
      console.log(`${chalk.blue('-')} Getting /blog folder for ${locale.full_slug}`)
      const blogFolderFullSlug = `${locale.full_slug}/blog`
      const blogFolderParams = { with_slug: blogFolderFullSlug };
      const blogFolder = (await getStoriesByParams(api, blogFolderParams))?.[0]

      if (!blogFolder) {
        console.log(`${chalk.bgYellow(`Locale ${locale.full_slug} has no blog folder`)} `)
        continue
      }

      // console.log(`${chalk.bgGreen(`${blogFolder.full_slug}, ${blogFolder.id}, ${blogFolder.parent_id}`)}`)

      // get logs for the current folder
      console.log(`${chalk.blue('-')} Getting blogs for ${blogFolder.full_slug}`)
      const blogParams = {
        contain_component: 'blogPage',
        starts_with: blogFolder.full_slug,
        is_published: true
      }
      const blogPages = await getStoriesByParams(api, blogParams)
      if (isEmpty(blogPages)) {
        console.log(`${chalk.blue('-')} There are no blogs for ${blogFolder.full_slug}!`)
        continue
        // return Promise.resolve({
        //   executed: false,
        //   motive: 'NO_STORIES'
        // })
      }
      for (const blog of blogPages) {
        try {
          if (blog.parent_id === blogFolder.id) {
            console.log(chalk.bgYellow(`Blog ${blog.full_slug} already in blog root.`))
            console.log(`${chalk.blue('-')} Bypassed!`)
            console.log()
            continue
          }
          // console.log(chalk.bgGreen(`${blog.full_slug}, parent: ${blog.parent_id}`))
          console.log(`${chalk.blue('-')} Re-locating blog ${blog.full_slug}`)

          const url = `stories/${blog.id}`
          const payload = { story: { parent_id: blogFolder.id } }
          if (blog.unpublished_changes) {
            console.log(chalk.bgYellow(`Blog ${blog.full_slug} has unpublished changes. Won't publish it.`))
          } else {
            // if (bypassPages.has(blog.full_slug)) {
            //   console.warn(`  - ${chalk.bgYellow('warning---')} Skip publishing: ${chalk.bgYellowBright(blog.full_slug)}`)
            // } else {
            payload.publish = '1'
          }

          await api.put(url, payload)

          console.log(`${chalk.blue('-')} Blog updated with success!`)
        } catch (e) {
          console.error(`${chalk.red('X')} An error occurred when migrating the blog: ${e.message}`)
        }

        console.log()
      }
    }

    console.log(`${chalk.green('✓')} The blogs were migrated with success!`)
    return Promise.resolve({
      executed: true
    })
  } catch (e) {
    return Promise.reject(e)
  }
}

module.exports = runWeb559
