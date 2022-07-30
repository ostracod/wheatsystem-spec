
# WheatSystem Specification

This repository contains resources to generate documentation for WheatSystem. The generated documentation is hosted on [this webpage](http://www.ostracodfiles.com/wheatsystem/menu.html).

This repository may also be used as a Node.js module to provide opcodes and argument amounts to dependents. The module exports the following members:

* `interfaces`: Provides TypeScript interfaces used by this module.
* `constants`: Provides constant values used by this module.
* `specUtils`: Provides functions to generate documentation.
* `specLine`: Provides classes which store lines of specification.
* `definition`: Provides classes for error, instruction, and function definitions.
* `member`: Provides classes for arguments of instructions and functions.
* `dataType`: Provides classes to specify data types of arguments.
* `lineConverter`: Provides classes to convert specification lines to HTML.

## Usage

This project has the following system-wide dependencies:

* Node.js version ^16.4
* TypeScript version ^4.5

To generate the documentation:

1. Compile TypeScript code: `npm run build`
1. Run the generation script: `node ./dist/generate.js`

To use this repository as a dependency, add the following line to `dependencies` in your `package.json` file, replacing `(version)` with the desired version number:

```
"wheatsystem-spec": "github:ostracod/wheatsystem-spec#semver:^(version)"
```


