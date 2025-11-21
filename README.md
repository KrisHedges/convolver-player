# Convolver Player Components

[![CI Checks](https://github.com/krishedges/convolver-player/actions/workflows/ci.yml/badge.svg)](https://github.com/krishedges/convolver-player/actions/workflows/ci.yml)

This monorepo contains UI components designed to apply convolution reverb to an audio source. The primary goal is to provide framework-specific packages for easy integration into various frontend applications.

## Monorepo Structure

This project is managed as a monorepo using [Yarn Workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/). This means there is a single root repository that manages multiple sub-packages. All component packages are located within the `packages` directory.

## Packages

| Package | npm | License | Description |
| --- | --- | --- | --- |
| `@convolver-player/core` | [![npm](https://img.shields.io/npm/v/@convolver-player/core.svg)](https://www.npmjs.com/package/@convolver-player/core) | [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) | Internal package containing the core logic. Not intended for direct use. |
| `@convolver-player/react` | [![npm](https://img.shields.io/npm/v/@convolver-player/react.svg)](https://www.npmjs.com/package/@convolver-player/react) | [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) | React component for convolution reverb. |
| `@convolver-player/vue` | [![npm](https://img.shields.io/npm/v/@convolver-player/vue.svg)](https://www.npmjs.com/package/@convolver-player/vue) | [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) | Vue component for convolution reverb. |

## Getting Started

To get started with development, follow these steps:

### 1. Installation

Navigate to the root directory of the monorepo and install all dependencies for all packages:

```bash
yarn install
```

### 2. Development

To start the development server for a specific UI package, use the `yarn workspace` command. For example, to run the development server for the Vue component:

```bash
yarn workspace @convolver-player/vue dev
```

### 3. Building

To build all packages in the monorepo for production, run:

```bash
yarn build
```

### 4. Testing

To run all unit tests across all packages in the monorepo, run:

```bash
yarn test
```

## Publishing to npm

This project uses [Changesets](https://github.com/changesets/changesets) to manage versioning and publishing.

### 1. Add a Changeset

When you have made a change that you want to be released, run:

```bash
yarn changeset
```

This will ask you a series of questions about the changes you have made, and then generate a new changeset file.

### 2. Versioning

To apply the changesets and update the package versions and changelogs, run:

```bash
yarn changeset version
```

This will consume the changeset files and update the `package.json` versions and `CHANGELOG.md` files.

### 3. Publishing

To publish the packages to npm, run:

```bash
yarn changeset publish
```

This will publish all packages that have been updated. You will need to be logged in to npm with `yarn login`.

## Contributing

Contributions are welcome! If you have ideas for new features, improvements, or bug fixes, please open an issue to discuss them before submitting a pull request. This helps ensure alignment with the project's goals and reduces the chance of duplicated effort.

Please see the [CONTRIBUTING.md](./CONTRIBUTING.md) file for more details.