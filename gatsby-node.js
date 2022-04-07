const fetch = require("node-fetch")

function buildUrls(navigationIdsOrSlugs, apiURL, type) {
  return navigationIdsOrSlugs
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

  navigationItemsArr.map((navigationItems) =>
    navigationItems.map((item) => {
      createNode({
        ...item,
        id: createNodeId(`${STRAPI_NODE_TYPE}-${item.id}`),
        parent: null,
        children: [],
        internal: {
          type: STRAPI_NODE_TYPE,
          content: JSON.stringify(item),
          contentDigest: createContentDigest(item),
        },
      })
    }))

  reporter.success("Successfully sourced all navigation items.")
}
