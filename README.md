# Convolver Player Components

This monorepo contains UI components designed to apply convolution reverb to an audio source. The primary goal is to provide framework-specific packages for easy integration into various frontend applications, starting with Vue.

## Monorepo Structure

This project is managed as a monorepo using [Yarn Workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/). This means there is a single root repository that manages multiple sub-packages. All component packages are located within the `packages` directory.

## Packages

### `@convolver-player/core`

*   **Location**: `packages/core/convolver-player-core`
*   **Language**: TypeScript
*   **Description**: Contains the core, framework-agnostic logic for audio processing (Web Audio API management, impulse response loading, convolution, gain control) and waveform visualization. This package is designed to be consumed by framework-specific component implementations.

### `@convolver-player/vue`

*   **Location**: `packages/vue/vue-convolver-player`
*   **Framework**: Vue 3
*   **Language**: TypeScript
*   **Build Tool**: Vite (configured with `rolldown-vite` for experimental performance)
*   **Description**: The Vue version of the convolver player component, offering a customizable audio convolution experience, built on top of `@convolver-player/core`.

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

This will typically open a local development server (e.g., `http://localhost:5173`) where you can see the component in action and make live changes.

### 3. Building

To build a specific package for production, use the `yarn workspace` command with the `build` script. For example, to build the Vue component:

```bash
yarn workspace @convolver-player/vue build
```

Or to build the core library:

```bash
yarn workspace @convolver-player/core build
```

These commands will compile the respective package into its distributable format.

### 4. Testing

To run the unit tests for a specific package, use the `yarn workspace` command with the `test:run` script. This will execute all tests once and report the results:

```bash
yarn workspace @convolver-player/vue test:run
```

Or for the core library:

```bash
yarn workspace @convolver-player/core test:run
```

If you wish to run tests with coverage reporting:

```bash
yarn workspace @convolver-player/vue test:run:coverage
```

Or for the core library:

```bash
yarn workspace @convolver-player/core test:run:coverage
```

## Contributing

Contributions are welcome! If you have ideas for new features, improvements, or bug fixes, please open an issue to discuss them before submitting a pull request. This helps ensure alignment with the project's goals and reduces the chance of duplicated effort.

### How to Contribute:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes, ensuring they adhere to the existing code style and conventions.
4.  Write or update tests as appropriate.
5.  Ensure all tests pass (`yarn workspace @convolver-player/vue test:run`).
6.  Submit a pull request with a clear description of your changes.