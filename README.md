## load pkg chrome extension

## Features
- Use manifest-version `3.0`
- Support esm, like `const _ = await _pkg_esm('lodash-es')`
- Support javascript and CSS packages in npm, like `_pkg('lodash')` or `_pkg('animate.css')`
- Support npm package scope, like `_pkg('lodash@4.17.21')`  `_pkg('lodash@4')`
- Support subpath in npm packages, like `_pkg('lodash/lodash.min.js')`
- Support any CDN files, like `_pkg('https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js')`

## Usage

1. [`Download`](https://github.com/sxy15/pkg-chrome-extension/releases) this extension and install it in the browser extension page(like `chrome://extensions/`).
2. Use `_pkg` `_pkg_esm` in dev-tools to install packages from npm or CDN.

## Thanks

1. [jsDelivr](https://www.jsdelivr.com/) - All npm assets are provided by it.
2. [plasmo](https://www.npmjs.com/package/plasmo) - The Plasmo Framework is a battery-packed browser extension SDK.
3. [`console-importer`](https://github.com/pd4d10/console-importer)
