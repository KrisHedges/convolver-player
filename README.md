# Convolver Player Components

This monorepo contains UI components designed to apply convolution reverb to an audio source. The goal is to provide framework-specific packages for easy integration into Vue and React applications.

## Monorepo Structure

This project is managed as a monorepo using Yarn Workspaces. All component packages are located in the `packages` directory.

### Packages

-   **`@convolver-player/vue`**: The Vue version of the convolver player component. It is built with Vue, TypeScript, and Vite.

## Getting Started

To install dependencies for all packages, run the following command from the root directory:

```bash
yarn install
```

To start the development server for a specific package, use Yarn workspaces. For example, to run the Vue component's dev server:

```bash
yarn workspace @convolver-player/vue dev
```

## Contributing

Contributions are welcome. Please open an issue to discuss your ideas before submitting a pull request.
