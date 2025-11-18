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

---

**Yarn Classic Workspace Quirk (v1.x):**

When declaring dependencies between internal monorepo packages, Yarn Classic (v1.x) can sometimes exhibit unexpected behavior with the `workspace:` protocol in the `dependencies` section of a package's `package.json`. While `workspace:^1.0.0` is the recommended and explicit way to link local packages, `yarn install` might fail, trying to resolve it from the npm registry.

In such cases, using a fixed version (e.g., `"1.0.0"`) that matches the local package's version might be necessary to allow `yarn install` to succeed. This is a known quirk, and using `workspace:` protocol is generally more robust in Yarn Berry (v2+) or other package managers like pnpm.

For this project, the `@convolver-player/vue` package uses `"@convolver-player/core": "1.0.0"` to ensure `yarn install` completes successfully, while `@convolver-player/react` uses `"@convolver-player/core": "workspace:^1.0.0"`. This discrepancy is due to the observed behavior with Yarn Classic.