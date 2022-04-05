# gatsby-source-strapi-plugin-navigation-v2

This plugin sources the [strapi-plugin-navigation](https://github.com/VirtusLab-Open-Source/strapi-plugin-navigation).

## Install

yarn:
```bash
yarn add gatsby-source-strapi-plugin-navigation
```
npm:
```bash
npm install gatsby-source-strapi-plugin-navigation
```

## How to use
```js
// gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: "gatsby-source-strapi-plugin-navigation-v2",
      options: {
        apiURL: "Strapi url",
        navigationIdsOrSlugs: [
          "api/navigation/render/1"
        ],
        type: "tree", // optional
        token: "Strapi token" // optional
      }
    }
  ]
}
```

## Credits
Heavily inspired by [edardev's](https://github.com/edardev/gatsby-source-strapi-plugin-navigation) sourcing plugin.
