const chalk = require('chalk')

module.exports = function (block, fullSlug) {
  // console.log(fullSlug);
  // console.log(block);
  const category = block.categoryValue?.selectedOption;

  let tag = getTagByCategory(category, fullSlug);
  if (!tag) {
    console.warn(`  - ${chalk.bgYellow('warning---')} category: ${chalk.bgYellowBright(category)} Will try to parse from fullSlug:`)
    const categoryFromPath = fullSlug.split('/')[2];
    console.log(`  - ${chalk.bgGreenBright('success===')} ${chalk.bgYellow(categoryFromPath)}`);
    tag = getTagByCategory(categoryFromPath, fullSlug)
  }
  if (!tag) {
    console.error(`  - ${chalk.bgRed('error---')} category: ${chalk.bgRed(category)}, title: ${block.title}`)
    return;
  }

  console.log(`  - ${chalk.bgGreen('success===')} ${chalk.bgYellow(category)} -> ${chalk.bgYellow(tag)}`);

  const blogTags = [
    {
      tag,
      component: "blogGlobalTag",
    }
  ];
  // delete block.blogTags;
  // block.blogTags = JSON.stringify(blogTags);
  block.blogTags = blogTags;
}

const getTagByCategory = (category, fullSlug) => {
  if (fullSlug.startsWith('br/')
      || fullSlug.startsWith('la-es')) {
    return brMap[category];
  }

  if (fullSlug.startsWith('ru/')
      || fullSlug.startsWith('kz-ru/')) {
    return ruMap[category];
  }

  return categoryToTagMap[category];
};

const categoryToTagMap = {
  "admission-news":"admissions-news",
  "med-school":"med-school",
  "test-prep":"test-prep",
  "essays-and-interviews":"essay",
  "extracurriculars":"extracurriculars",
  "campus-life-more":"admissions-advice",
  "college-student-insight":"college-student-insights",
  "tbd_a":"graduate-prep",
  "tbd_b":"junior-prep",
};

const brMap = {
  "admission-news":"faculdades",
  "test-prep":"preparação-para-provas",
  "essays-and-interviews":"redações-e-entrevistas",
  "extracurriculars":"atividades-extracurriculares",
  "college-student-insight":"college-student-insights",
  'college-in-the-us': 'faculdade-nos-estados-unidos',
  'college-in-the-uk': 'faculdade-no-reino-unido',
}
const ruMap = {
  "admissions-news":"oб-университетах-и-поступлении-в-них",
  "admission-news":"oб-университетах-и-поступлении-в-них",
  "test-prep":"экзамены-и-тестирования",
  "essays-and-interviews":"эссе-и-интервью",
  "extracurriculars":"внеклассные-активности",
  "campus-life-more":"жизнь-в-кампусе-и-не-только ",
  "college-student-insight":"истории-студентов",
};
