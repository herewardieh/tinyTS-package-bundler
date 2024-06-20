# tinyTS-package-bundler

Tiny tool kit to build your typescript project, powered by [tsup](https://github.com/egoist/tsup).

### Advantage of tiny-ts-package-bundler?

it allows generating JavaScript files in ES Module (ESM) and CommonJS (CJS) formats, global declaration files, and a package.json file that contains most of the information for repositories.

### Installation

```sh
npm i tiny-ts-package-bundler --save
```

Recommend you use `pnpm`:

```sh
pnpm add tiny-ts-package-bundler
```

### Usage

powered by tsup so default target is node16 if you want to change build target please configure in package.json file as below:

```js
{
    "name": "your application name",
    "version": "x.x.x",
    "tinyTsPkgBundler": {
        "platform": "browser",
        "target": "es5"
    },
    // "install": "tiny-ts-package-bundler",
    "prepublishOnly": "tiny-ts-package-bundler",
    "keywords": [],
    ...
}
```

For more configuration options, please see [API](https://tsup.egoist.dev/).
