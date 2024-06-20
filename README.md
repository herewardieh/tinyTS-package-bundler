# tinyTS-package-bundler

Tiny tool kit to build your typescript project, powered by [tsup](https://github.com/egoist/tsup).

## Advantage of tiny-ts-package-bundler?

its support for generating js in commonjs and es module, global declaration files, and a package.json file that contains most of the information for repositories.

## Installation

```sh
npm i tiny-ts-package-bundler --save
```

Recommend you use `pnpm`:

```sh
pnpm add tiny-ts-package-bundler
```

## Usage

powered by tsup so default target is node16 if you want to change build target please configure in package.json file as below:
For more configuration options, please see [the API docs](https://paka.dev/npm/tsup#module-index-export-Options).

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
