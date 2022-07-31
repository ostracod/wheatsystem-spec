
# WheatSystem Specification

This repository contains resources to generate documentation for WheatSystem. The generated documentation is hosted on [this webpage](http://www.ostracodfiles.com/wheatsystem/menu.html).

This repository may also be used as a Node.js module to provide error, instruction, and function definitions to dependents. The module exports the following members:

* `specification`: Provides classes to generate error, instruction, and function definitions.
* `definition`: Provides classes which represent error, instruction, and function definitions.
* `member`: Provides classes for arguments of instructions and functions.
* `dataType`: Provides classes to specify data types of arguments.
* `instances`: Provides instances of specification classes.

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


