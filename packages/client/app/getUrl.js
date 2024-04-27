const mapper = {
  server: {
    protocol: process.env.SERVER_PROTOCOL,
    host: process.env.SERVER_HOST,
    port: process.env.SERVER_PORT,
  },
}

const removeTrailingSlashes = url => url.replace(/\/+$/, '')

const sanitizeUrl = url => {
  if (!url) return null
  return removeTrailingSlashes(url)
}

const makeUrl = type => {
  const { protocol, host, port } = mapper[type]
  if (!protocol || !host || !port) return null
  const url = `${protocol}://${host}${port ? `:${port}` : ''}`
  return sanitizeUrl(url)
}

const serverUrl = makeUrl('server')

module.exports = {
  serverUrl,
}
