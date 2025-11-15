# Project Overview: Convolver Player

This is a monorepo for the `convolver-player` component, with separate packages for different frontend frameworks.

## Project Setup

-   **Manager**: Yarn Workspaces
-   **Monorepo Root**: `/Users/krishedges/code/convolver-player`
-   **Workspace Structure**: The root `package.json` is configured with `workspaces: ["packages/vue/*"]`.

## Packages

### `@convolver-player/vue`

-   **Location**: `packages/vue/vue-convolver-player`
-   **Framework**: Vue
-   **Variant**: TypeScript
-   **Builder**: Vite with `rolldown-vite` (Experimental)

## Yarn Commands

-   **Install all dependencies**: `yarn install` (run from the root)
-   **Run command in a specific package**: `yarn workspace <package-name> <command>`
    -   Example: `yarn workspace @convolver-player/vue dev`
-   **Run command in all packages**: `yarn workspaces foreach run <command>`
    -   Example: `yarn workspaces foreach run build`
