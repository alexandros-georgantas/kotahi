const axios = require('axios')
const { JSDOM } = require('jsdom')
const { pubsubManager } = require('@coko/server')

const { getPubsub } = pubsubManager

const menuOptions = [
  '#navigationPrimary',
  '#nav-menu',
  '.nav-bar-component',
  '#nav-menuNONRESP',
  '.navbar',
]

const scrapeHtml = async url => {
  const response = await axios
    .get(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
      },
    })
    .catch(axiosError => {
      console.error(`scrapHTML failed to get ${url}: ${axiosError}`)
      return { data: '<html></html>' }
    })

  let htmlWithoutSpace = response.data.replace(/>(\s+|\nr)(?![^<>]*<\/)/g, '> ')

  htmlWithoutSpace = htmlWithoutSpace.replace(/(\r\n|\n|\r)/g, '')
  htmlWithoutSpace = htmlWithoutSpace.replace(/\t/g, '')

  const doc = new JSDOM(htmlWithoutSpace)
  const parsedDocument = doc.window.document
  const navElement = parsedDocument.documentElement.querySelector('.page nav')

  if (navElement) {
    navElement.remove()
  }

  return parsedDocument.documentElement
}

async function pullHTML(document, element) {
  if (!element) console.error(`no element found for ${element}`)

  return document.querySelector(element).innerHTML
}

const getLogo = async (content, imageClosest, groupId) => {
  const pubsub = await getPubsub()
  pubsub.publish(`MIGRATION_STATUS_UPDATE`, {
    migrationStatusUpdate: 'getLogo',
  })

  const menuElement = content.querySelector(imageClosest)

  if (!menuElement) {
    return 'placeholder' // Return empty string if menu element is not found
  }

  const imageUrl = content.querySelector(imageClosest).querySelector('img')

  if (imageUrl) {
    return content.querySelector(imageClosest).querySelector('img').src
  }

  return 'placeholder'
}

//                      '#navigationPrimary', '.page'
const getTeam = async (content, closestElement, groupId) => {
  const pubsub = await getPubsub()
  pubsub.publish(`MIGRATION_STATUS_UPDATE`, {
    migrationStatusUpdate: 'getTeam',
  })

  let menuElement

  menuOptions.some(option => {
    menuElement = content.querySelector(option)
    return !!menuElement
  })

  if (!menuElement) {
    return 'placeholder' // Return empty string if menu element is not found
  }

  const linksToAbout = Array.from(menuElement.querySelectorAll('a')).filter(
    a => {
      if (a.href.endsWith('team') || a.href.endsWith('Team')) {
        return true
      }

      return false
    },
  )

  const aboutTeam = await Promise.all(
    linksToAbout.map(async a => {
      const scrapeContent = await scrapeHtml(a.href)
      return pullHTML(scrapeContent, closestElement)
    }),
  )

  if (!aboutTeam.length) return 'placeholder'

  return aboutTeam[0]
}

//                      '#navigationPrimary', '.page'
const getAbout = async (content, closestElement, groupId) => {
  const pubsub = await getPubsub()
  pubsub.publish(`MIGRATION_STATUS_UPDATE`, {
    migrationStatusUpdate: 'getAbout',
  })

  let menuElement

  menuOptions.some(option => {
    menuElement = content.querySelector(option)
    return !!menuElement
  })

  if (!menuElement) {
    return 'placeholder' // Return empty string if menu element is not found
  }

  const linksToAbout = Array.from(menuElement.querySelectorAll('a')).filter(
    a => {
      if (a.href.endsWith('about')) {
        return true
      }

      return false
    },
  )

  const aboutContents = await Promise.all(
    linksToAbout.map(async a => {
      const scrapeContent = await scrapeHtml(a.href)
      return pullHTML(scrapeContent, closestElement)
    }),
  )

  if (!aboutContents.length) return 'placeholder'

  return aboutContents[0]
}

const crossrefScrape = async (url, groupId) => {
  try {
    const document = await scrapeHtml(url)

    const scrappedMeta = {
      logourl: await getLogo(document, '.pkp_site_name', groupId),
      aboutContent: await getAbout(document, '.page', groupId),
      teamContent: await getTeam(document, '.page', groupId),
    }

    return scrappedMeta
  } catch (err) {
    console.error(`${url} error in url access: ${err}`)
    return {
      logourl: 'placeholder',
      aboutContent: 'placeholder',
      teamContent: 'placeholder',
    }
  }
}

module.exports = { crossrefScrape }
