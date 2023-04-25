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

const runWeb559 = async (api, options = {}) => {
  // const rollbackData = []
  const component = 'blogPage'

  try {
    console.log(`${chalk.blue('-')} Getting all top level folders`)
    const folderParams = {
      folder_only: true,
      with_parent: 0,
      // per_page: 5,
      starts_with: 'la-es',
    }
    const localeFolders = await getStoriesByParams(api, folderParams)

    if (isEmpty(localeFolders)) {
      console.log(`${chalk.blue('-')} There are no child folders of 0!`)
      return Promise.resolve({
        executed: false,
        motive: 'NO_FOLDERS'
      })
    }
    for (locale of localeFolders) {
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
        return Promise.resolve({
            executed: false,
            motive: 'NO_STORIES'
        })
      }
      for (const blog of blogPages) {
        try {
          if (blog.parent_id === blogFolder.id) {
            console.log(chalk.bgYellow(`Blog ${blog.full_slug} already in blog root.`))
            console.log(`${chalk.blue('-')} Bypassed!`)
            console.log()
            continue
          }
          console.log(chalk.bgGreen(`${blog.full_slug}, parent: ${blog.parent_id}`))

          const url = `stories/${blog.id}`
          const payload = { story: { parent_id: blogFolder.id } }
          await api.put(url, payload)
          console.log(`${chalk.blue('-')} Blog updated with success!`)
        } catch (e) {
          console.error(`${chalk.red('X')} An error occurred when migrating the blog: ${e.message}`)
        }

        console.log()
      }
    }
    return;

    const stories = await getStoriesByParams(api, folderParams)
    if (isEmpty(stories)) {
      console.log(`${chalk.blue('-')} There are no stories for component ${component}!`)
      return Promise.resolve({
        executed: false,
        motive: 'NO_STORIES'
      })
    }
    for (const story of stories) {
      try {
        console.log(
          `${chalk.blue('-')} Processing story ${story.full_slug}`
        )
        // const storyData = await api.getSingleStory(story.id)
        // const oldContent = cloneDeep(storyData.content)
        // const isChangeContent = !isEqual(oldContent, storyData.content)
        const isChangeContent = true;

        // to prevent api unnecessary api executions
        if (!options.isDryrun && isChangeContent) {
          console.log(
            `${chalk.blue('-')} Updating story ${story.full_slug}`
          )
          const url = `stories/${story.id}`

          // create a rollback object
          // rollbackData.push({
          //   id: storyData.id,
          //   full_slug: storyData.full_slug,
          //   content: oldContent
          // })

          const payload = {
            // story: storyData,
            // force_update: '1'
          }

          console.log(`${story.full_slug}, ${story.id}, ${story.parent_id}`)
          // await api.put(url, payload)
          console.log(
            `${chalk.blue('-')} Story updated with success!`
          )
        }
      } catch (e) {
        console.error(`${chalk.red('X')} An error occurred when migrating the story: ${e.message}`)
      }

      console.log()
    }

    // send file of rollback to save in migrations/rollback directory
    // if (!isEmpty(rollbackData)) {
    //   await createRollbackFile(rollbackData, component, field)
    // }

    console.log(`${chalk.green('✓')} The blogs were migrated with success!`)
    return Promise.resolve({
      executed: true
    })
  } catch (e) {
    return Promise.reject(e)
  }
}

module.exports = runWeb559
