const semver = require('semver')
const output = require('./output')

/**
 *
 * @param { {} } obj
 * @param { string } valueToCompare
 *
 */

const check = function (obj, valueToCompare) {
  const result = { // instantiate the object we want to return. All types should remain the same.
    isVulnerable: false,
    vulnerableVersions: [],
    vulnerableVersionsHumanReadable: '',
    blogLinks: [],
    blogLinksHumanReadable: '',
    blogLinksHumanReadableWithNewLines: ''
  }

  for (var version in obj) {
    if (obj[version].metadata.security === true) { // checka Node.js metadata to see if the release is indeed a security release.
      try {
        const majorOfValueToCompare = semver.major(valueToCompare)
        const majorOfIteratedValue = semver.major(obj[version].version)
        if (semver.lt(valueToCompare, obj[version].version) === true && majorOfIteratedValue <= majorOfValueToCompare) {
          const iteratedVersion = obj[version].version
          result.isVulnerable = true
          result.vulnerableVersions.push(semver.clean(iteratedVersion))
          result.blogLinks.push(`https://nodejs.org/en/blog/release/v${semver.clean(iteratedVersion)}/`)
        }
      } catch (error) {
        process.exit(output('Something was wrong with the semver value you passed! Make sure you\'re using a valid semver number.If you\'re trying a major or major and minor, make sure you\'re including a v, like v12 or v8.6', 'human', 'error'))
      }
    }
  }

  result.vulnerableVersionsHumanReadable = result.vulnerableVersions.join(', ')
  result.blogLinksHumanReadable = result.blogLinks.join(', ')
  result.blogLinksHumanReadableWithNewLines = result.blogLinks.join('\n')

  return result
}

module.exports = check
