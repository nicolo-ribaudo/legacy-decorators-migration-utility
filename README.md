# Legacy decorators migration utility

This repository contains a series of packages that make it easier to migrate
from legacy decorators to the new version of the proposal. This utils are
mainly meant for decorators consumers, but the `decorators-compat` package could
also be used by decorators authors.
This utilities only work with class decorators: since object decorators aren't
included in the decorators proposal anymore, you will need to manually remove
them.

TL;DR:

```
$ npx wrap-legacy-decorators path/to/file.js --decorators-before-export
```

## Packages

### `wrap-legacy-decorators`

This package contains a command line utility to upgrade a JavaScript file to the
current decorators semantics. It is meant to be either used with `npx` or
installed globally:

```
$ npx wrap-legacy-decorators file.js

OR:

$ npm install --global wrap-legacy-decorators
$ wrap-legacy-decorators file.js

OR:

$ yarn global add wrap-legacy-decorators
$ wrap-legacy-decorators file.js
```

#### Options

| **Option**           | **Description**           |
|----------------------|---------------------------|
| `-h, --help`         | Show usage information.   |
| `-v, --version`      | Show the utility version. |
| `--decorators-before-export` or `--decorators-after-export` | (*Required*) Sets the position of decorators relative to the `export` keyword. |
| `--external-helpers` | Use the `decorators-compat` package instead of inserting the helper inline in each file. |
| `--write`            | Update the file in-place, instead of printing the modified code to the console. | 

### `decorators-compat`

This module exports a function which wraps any legacy decorator, making it compatible with the new proposal. If you are using the `wrap-legacy-decorators` command with the `--external-helpers` flag, you must add this package to your dependencies:

```
$ npm install --save decorators-compat

OR:

$ yarn add decorators-compat
```

#### Usage

```js
// If you where using a legacy decorator like this:

@legacyDecorator1
@legacyDecorator2
class Foo {}

// ... when upgrading to the new proposal it should become something like this:

import decoratorsCompat from "decorators-compat";

@decoratorsCompat([legacyDecorator1, legacyDecorator2])
class Foo {}
```

#### Caveats

Since legacy decorators are applyed to the finished class rather then to an intermediate representation, they always run *after* modern decorators. For this reason, it is highly reccomended to write the legacy decorators you are using *before* the modern decorators.

### `babel-plugin-wrap-legacy-decorators`

This Babel plugin is used internally by the `wrap-legacy-decorators` command line utility. It accepts two options: `decoratorsBeforeExport: boolean` and `externalHelpers: boolean`.
