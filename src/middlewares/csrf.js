const hostValidation = require('host-validation')

// - Host header only contains the domain, so something like 'build-api-asdf127773.heroku.sh' or 'fleet.com'
// - Referer header contains the entire URL, so something like 'https://build-api-asdf127773.heroku.sh/forward' or 'https://fleet.com/forward'
// That means we have to check the Host slightly differently from the Referer to avoid things like 'my-domain-fleet.com' to be able to hack our users

// Hosts, without http(s):// and paths
const trustedHosts = [
  process.env.HEROKU_URL &&
    new RegExp(`^${process.env.HEROKU_URL.replace('https://', '')}$`),
  /^fleet\.com$/,
  // All subdomains
  /^.*\.fleet\.com$/
].filter(Boolean)

// Referers, with http(s):// and paths
const trustedReferers = [
  process.env.HEROKU_URL && new RegExp(`^${process.env.HEROKU_URL}($|\/.*)`),
  /^https:\/\/fleet\.com($|\/.*)/,
  // All subdomains
  /^https:\/\/.*\.fleet\.com($|\/.*)/
].filter(Boolean)

module.exports = hostValidation({
  hosts: trustedHosts,
  referers: trustedReferers,
  mode: 'either'
})
