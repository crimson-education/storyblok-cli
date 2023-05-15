const { bgYellow, bgGreen } = require('../utils/util')

module.exports = function (block, fullSlug) {
  // Example to change a string to boolean
  // block.blogTagsMV = !!(block.blogTagsMV)

  // Example to transfer content from other field
  // block.blogTagsMV = block.other_field
  const slugSegments = fullSlug.split('/')
  console.log(JSON.stringify(slugSegments))

  let tag = slugSegments[slugSegments.length - 2]
  if (tag === 'blog') {
    bgYellow(`blog found in root folder`)
    tag = 'others'
  }
  bgGreen(`Tag: ${tag}`)

  block.blogTags = [{
    tag,
    component: "blogGlobalTag",
  }]
}
