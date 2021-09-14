const userSeeder = require('./user')
const faqSeeder = require('./faq')
const contributionSeeder = require('./contribution')
const contributionRelationSeeder = require('./contribution-relation')
const contributionDraft = require('./contribution-draft')
const commentSeeder = require('./comment')
const relatedMediaSeeder = require('./related-media')

module.exports = {
  users: userSeeder(),
  faq: faqSeeder(),
  contribution: contributionSeeder(),
  contributionRelation: contributionRelationSeeder(),
  comment: commentSeeder(),
  relatedMedia: relatedMediaSeeder(),
  contributionDraft: contributionDraft()
}
