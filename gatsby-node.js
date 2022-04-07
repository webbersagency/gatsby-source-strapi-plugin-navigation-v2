const fetch = require("node-fetch")

function buildUrls(navigationIdsOrSlugs, apiURL, type) {
  if (Array.isArray(navigationIdsOrSlugs)) {
    return navigationIdsOrSlugs
      .map((idOrSlug) => `${apiURL}/${idOrSlug}${type ? `?type=${type}` : ""}`)
  }

  return Object.values(navigationIdsOrSlugs)
    .map((idOrSlug) => `${apiURL}/${idOrSlug}${type ? `?type=${type}` : ""}`)
}

const fetchNavigationItems = async (urls, headers) => {
  return await Promise.all(
    urls.map(async (u) => {
      const response = await fetch(u, {
        headers: headers,
      })
      return await response.json()
    }),
  )
}

const STRAPI_NODE_TYPE = `StrapiNavigation`

exports.sourceNodes = async ({
  actions: {createNode},
  createNodeId,
  createContentDigest,
  reporter,
}, {apiURL, token, navigationIdsOrSlugs, type}) => {
  const urls = buildUrls(navigationIdsOrSlugs, apiURL, type)

  const headers = {}

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const navigationItemsArr = await fetchNavigationItems(urls, headers)

  let keys

  if (typeof navigationIdsOrSlugs === "object" && !Array.isArray(navigationIdsOrSlugs)) {
    keys = Object.keys(navigationIdsOrSlugs)
  }

  navigationItemsArr.map((navigationItems, index) =>
    navigationItems.map((item) => {
      const node = {
        ...item,
        id: createNodeId(`${STRAPI_NODE_TYPE}-${item.id}`),
        parent: null,
        children: [],
        internal: {
          type: STRAPI_NODE_TYPE,
          content: JSON.stringify(item),
          contentDigest: createContentDigest(item),
        },
      }

      if (keys) {
        node["key"] = keys[index]
      }

      createNode(node)
    }))

  reporter.success("Successfully sourced all navigation items.")
}
