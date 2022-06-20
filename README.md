
# WheatSystem Specification

This repository contains resources to generate documentation for WheatSystem. The generated documentation is hosted on [this webpage](http://www.ostracodfiles.com/wheatsystem/menu.html).

This repository may also be used as a Node.js module to provide opcodes and argument amounts to dependents. The module exports the following members:

* `interfaces`: Provides TypeScript interfaces used by this module.
* `constants`: Provides constant values used by this module.
* `specUtils`: Provides functions to generate documentation.
* `instructionClasses`: Provides classes related to bytecode instructions.

## Usage

This project has the following system-wide dependencies:

* Node.js version ^16.4
* TypeScript version ^4.5

To generate the documentation:

1. Compile TypeScript code: `tsc`
2. Run the generation script: `node ./dist/generate.js`

To use this repository as a dependency, add the following line to `dependencies` in your `package.json` file, replacing `(version)` with the desired version number:

```
"wheatsystem-spec": "github:ostracod/wheatsystem-spec#semver:^(version)"
```


