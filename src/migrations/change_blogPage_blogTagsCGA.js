const { bgYellow, bgGreen } = require('../utils/util')

module.exports = function (block, fullSlug) {
  const localeLessSlug = fullSlug.substring(fullSlug.indexOf('/') + 1);
  const tags = getTags(localeLessSlug);
  if (!tags) {
    bgYellow(`No tags found for ${localeLessSlug}`)
    return
  }
  bgGreen(`tags: ${JSON.stringify(tags)}`)

  const blogTags = []
  for (const tag of tags) {
    blogTags.push({
      tag,
      component: "blogGlobalTag",
    })
  }
  block.blogTags = blogTags;
}

const getTags = (localeLessSlug) => {
  const auTags = auTagsMap[localeLessSlug]
  const nzTags = nzTagsMap[localeLessSlug]

  if (!auTags && !nzTags) {
    return
  }

  if (auTags) {
    bgGreen(`au: ${JSON.stringify(auTags)}`)
    if (nzTags) {
      bgGreen(`nz: ${JSON.stringify(nzTags)}`)
      bgGreen(`au && nz`)
      return mergeTags(auTags, nzTags);
    }
    bgGreen(`au no nz`)
    return auTags
  }
  bgGreen(`nz: ${JSON.stringify(nzTags)}`)
  bgGreen(`nz no au`)
  return nzTags
}

const mergeTags = (auTags, nzTags) => {
  let foundAndLogged = false;
  let merged = [...auTags]
  for (const nzt of nzTags) {
    if (!auTags.includes(nzt)) {
      merged.push(nzt)
      if (!foundAndLogged) {
        bgYellow(`NZ tags merged into AU tags`)
        foundAndLogged = true
      }
    }
  }
  return merged;
}

const auTagsMap = { "blog/teacher-spotlight-isla-mcknight": ["teachers"], "blog/what-is-chatgpt": ["technology"], "blog/top-5-advanced-placement-courses-to-take-for-college-success": ["academic-success", "college-career-planning"], "blog/crimson-code": ["subject-guides", "technology", "extracurriculars"], "blog/news": ["student-life", "academic-success", "community"], "blog/news/crimson-community-announcement": ["community", "academic-success"], "blog/news/first-in-person-cga-student-meet-up": ["student-life", "community"], "blog/extracurricular-and-leadership": ["extracurriculars", "student-life"], "blog/news/cga-career-discovery-series": ["college-career-planning"], "blog/importance-of-education-amy-kunrojpanya": ["college-career-planning"], "blog/head-of-greenwich": ["student-life", "extracurriculars"], "blog/teacher-spotlight-edie-griffiths": ["teachers"], "blog/math-club": ["extracurriculars", "student-life"], "blog/investment-club": ["extracurriculars", "student-life"], "blog/10-tips-for-a-level-exams": ["college-career-planning", "subject-guides"], "blog/cga-cambridge": ["community"], "blog/university-and-careers-counseling": ["college-career-planning", "university-admissions"], "blog/how-to-study-for-the-international-gcse-exams": ["college-career-planning", "subject-guides"], "blog/meet-the-principals-john-morris": ["teachers", "leadership"], "blog/game-development-club": ["extracurriculars", "student-life"], "blog/early-round-of-university-admissions": ["university-admissions"], "blog/web-development-club": ["extracurriculars", "student-life"], "blog/meet-the-principals-mark-phillips": ["teachers", "leadership"], "blog/cga-classroom-adventures": ["student-life"], "blog/community-and-support": ["community"], "blog/why-our-family-chose-cga-sage": ["testimonial"], "blog/cga-tech-parent-portal": ["community", "technology"], "blog/cga-wins-3rd-place-at-ethics-olympiad": ["academic-success", "community"], "blog/volunteer-club": ["extracurriculars", "student-life"], "blog/why-cga": ["subject-guides", "college-career-planning", "university-admissions"], "blog/learning-at-cga-geography": ["subject-guides"], "blog/model-un": ["extracurriculars", "student-life"], "blog/meet-our-partners-tutors-and-exams": ["community"], "blog/hsc-a-levels-ib-ap": ["subject-guides"], "blog/head-of-aoraki": ["extracurriculars", "student-life", "leadership"], "blog/what-is-online-school": ["community", "college-career-planning", "university-admissions"], "blog/curriculum-choices-the-exams": ["subject-guides", "college-career-planning"], "blog/how-to-get-an-a-in-a-level-bio": ["subject-guides", "college-career-planning"], "blog/differences-in-online-school-jamie-beaton": ["community", "leadership"], "blog/home-school": ["community"], "blog/curriculum-choices-the-content": ["subject-guides"], "blog/student-stories-anna-oxford-acceptance": ["academic-success", "testimonial", "university-admissions"], "blog/the-growing-role-of-technology-in-schools": ["technology"], "blog/prizegiving-ceremony-dec2022": ["community", "academic-success"], "blog/secrets-of-subject-selection": ["subject-guides"], "blog/all-about-the-international-a-levels": ["subject-guides"], "blog/student-testimonial-gemma": ["testimonial", "student-life"], "blog/how-to-ace-your-a-level-results": ["subject-guides"], "blog/study-science-online": ["subject-guides"], "blog/cga-student-leadership": ["student-life", "extracurriculars", "leadership"], "blog/why-online-school-is-better": ["college-career-planning", "community"], "blog/university-admission-with-the-international-a-levels": ["university-admissions", "college-career-planning"], "blog/digital-architects": ["subject-guides"], "blog/7-ways-tech-has-changed-the-face-of-education": ["technology"], "blog/a-levels-ib-ap": ["subject-guides"], "blog/internships": ["extracurriculars", "college-career-planning"], "blog/all-about-the-international-gcses": ["subject-guides"], "blog/why-diversity-and-inclusion-in-the-classroom-matter": ["community"], "blog/resources/guides/international-gcse-mathematics-guide": ["subject-guides"], "blog/why-i-joined-cga-mark-vella": ["teachers", "leadership"], "blog/resources/guides/international-gcse-english-literature-guide-ty": ["subject-guides"], "blog/cga-prizegiving-july-2022": ["academic-success", "community"], "blog/online-learning-decoded": ["community"], "blog/curriculum-choices-globally-recognised": ["subject-guides", "college-career-planning", "university-admissions"], "blog/cga-global-open-day": ["community"], "blog/additional-a-levels": ["subject-guides"], "blog/free-resources": ["community"], "blog/cga-prizegiving-december-2021": ["academic-success", "community"], "blog/john-morris-on-covid-an-educational-disruption-or-a-catalyst-for-change": ["community"], "blog/why-i-joined-cga-john-morris": ["leadership", "teachers"], "blog/resources/guides/cga-stories-yuko": ["student-life", "testimonial"], "blog/cga-s-first-prizegiving": ["academic-success", "community"], "blog/innovation-in-education": ["technology"], "blog/ai-a-new-era-in-education": ["technology"], "blog/3-things-shaping-the-future-of-online-learning": ["technology", "community"] };
const nzTagsMap = { "blog/crimson-code": ["subject-guides", "technology"], "blog/news": ["community", "student-life"], "blog/math-club": ["extracurriculars", "student-life"], "blog/igcse-vs-gcse": ["subject-guides"], "blog/cga-cambridge": ["university-admissions"], "blog/game-development-club": ["extracurriculars", "student-life"], "blog/teacher-spotlight-isla-mcknight": ["teachers"], "blog/news/first-in-person-cga-student-meet-up": ["community"], "blog/top-5-advanced-placement-courses-to-take-for-college-success": ["subject-guides", "college-career-planning", "university-admissions"], "blog/web-development-club": ["extracurriculars", "student-life"], "blog/how-to-study-for-the-international-gcse-exams": ["subject-guides"], "blog/extracurricular-and-leadership": ["extracurriculars", "student-life", "leadership"], "blog/volunteer-club": ["extracurriculars", "student-life"], "blog/head-of-aoraki": ["student-life", "extracurriculars"], "blog/community-and-support": ["community"], "blog/what-is-chatgpt": ["technology"], "blog/cga-tech-parent-portal": ["technology", "community"], "blog/why-our-family-chose-cga-sage": ["testimonial", "community"], "blog/news/crimson-community-announcement": ["community"], "blog/importance-of-education-amy-kunrojpanya": ["community"], "blog/meet-our-partners-tutors-and-exams": ["community", "teachers"], "blog/model-un": ["extracurriculars", "student-life"], "blog/10-tips-for-a-level-exams": ["subject-guides"], "blog/university-and-careers-counseling": ["college-career-planning", "university-admissions", "student-life"], "blog/head-of-greenwich": ["student-life", "extracurriculars"], "blog/investment-club": ["extracurriculars", "student-life"], "blog/a-levels-ib-ap": ["subject-guides", "college-career-planning", "university-admissions"], "blog/early-round-of-university-admissions": ["university-admissions"], "blog/what-is-online-school": ["community", "student-life"], "blog/news/cga-career-discovery-series": ["college-career-planning", "community"], "blog/how-to-ace-your-a-level-results": ["subject-guides"], "blog/university-admission-with-the-international-a-levels": ["subject-guides", "university-admissions"], "blog/study-science-online": ["subject-guides"], "blog/cga-classroom-adventures": ["community"], "blog/how-to-get-an-a-in-a-level-bio": ["subject-guides"], "blog/learning-at-cga-geography": ["subject-guides"], "blog/cga-student-leadership": ["student-life", "leadership"], "blog/why-cga": ["community", "student-life", "academic-success"], "blog/all-about-the-international-a-levels": ["subject-guides"], "blog/cga-wins-3rd-place-at-ethics-olympiad": ["academic-success", "community"], "blog/digital-architects": ["subject-guides"], "blog/curriculum-choices-the-exams": ["subject-guides"], "blog/student-stories-anna-oxford-acceptance": ["student-life", "university-admissions", "academic-success"], "blog/curriculum-choices-the-content": ["subject-guides"], "blog/secrets-of-subject-selection": ["subject-guides"], "blog/prizegiving-ceremony-dec2022": ["academic-success", "community"], "blog/why-online-school-is-better": ["community", "university-admissions", "student-life"], "blog/curriculum-choices-globally-recognised": ["subject-guides", "university-admissions"], "blog/teacher-spotlight-edie-griffiths": ["teachers"], "blog/differences-in-online-school-jamie-beaton": ["leadership", "community", "student-life"], "blog/cga-global-open-day": ["community"], "blog/student-testimonial-gemma": ["student-life", "testimonial"], "blog/meet-the-principals-mark-phillips": ["leadership", "teachers"], "blog/why-i-joined-cga-mark-vella": ["leadership", "teachers"], "blog/cga-prizegiving-july-2022": ["academic-success", "community"], "blog/7-ways-tech-has-changed-the-face-of-education": ["technology"], "blog/additional-a-levels": ["subject-guides"], "blog/home-school": ["community", "student-life"], "blog/all-about-the-international-gcses": ["subject-guides"], "blog/cga-prizegiving-december-2021": ["academic-success", "community"], "blog/meet-the-principals-john-morris": ["leadership", "teachers"], "blog/resources/guides/international-gcse-english-literature-guide-ty": ["subject-guides"], "blog/john-morris-on-covid-an-educational-disruption-or-a-catalyst-for-change": ["community"], "blog/why-i-joined-cga-john-morris": ["leadership", "teachers"], "blog/why-diversity-and-inclusion-in-the-classroom-matter": ["community"], "blog/online-learning-decoded": ["community", "student-life"], "blog/the-growing-role-of-technology-in-schools": ["technology", "community"], "blog/internships": ["extracurriculars", "college-career-planning"], "blog/resources/guides/international-gcse-mathematics-guide": ["subject-guides"], "blog/resources/guides/cga-stories-yuko": ["student-life", "testimonial"], "blog/cga-s-first-prizegiving": ["academic-success", "community"], "blog/free-resources": ["community"], "blog/innovation-in-education": ["technology"], "blog/ai-a-new-era-in-education": ["technology"], "blog/3-things-shaping-the-future-of-online-learning": ["technology", "community"] };
// const tagNameMap = {
//   "student-life": "Student Life",
//   "subject-guides": "Subject Guides",
//   "college-career-planning": "College & Career planning",
//   "university-admissions": "University Admissions",
//   "extracurriculars": "Extracurriculars",
//   "academic-success": "Academic Success",
//   "technology": "Technology",
//   "testimonial": "Testimonial",
//   "teachers": "Teachers",
//   "community": "Community",
//   "leadership": "Leadership"
// }
