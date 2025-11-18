# Convolver Player Components

This monorepo contains UI components designed to apply convolution reverb to an audio source. The primary goal is to provide framework-specific packages for easy integration into various frontend applications, starting with Vue.

## Monorepo Structure

This project is managed as a monorepo using [Yarn Workspaces](https://classic.yarnpkg.com/lang/en/docs/workspaces/). This means there is a single root repository that manages multiple sub-packages. All component packages are located within the `packages` directory.

## Packages

### `@convolver-player/core`

*   **Location**: `packages/core/convolver-player-core`
*   **Language**: TypeScript
*   **Description**: Contains the core, framework-agnostic logic for audio processing (Web Audio API management, impulse response loading, convolution, gain control) and waveform visualization. This package is designed to be consumed by framework-specific component implementations.


*   **Location**: `packages/vue/vue-convolver-player`
*   **Framework**: Vue 3
*   **Language**: TypeScript
*   **Build Tool**: Vite (configured with `rolldown-vite` for experimental performance)
*   **Description**: The Vue version of the convolver player component, offering a customizable audio convolution experience, built on top of `@convolver-player/core`.

#### Installation

```bash
yarn add @convolver-player/vue
```

#### Usage

The `ConvolverPlayer` component is designed to be unstyled by default, giving you complete control over its appearance. You will need to provide your own CSS to style the component. The waveform display will attempt to use the browser's `accent-color` for the waveform, with a fallback to a default blue color if `accent-color` is not available.

##### Simple Usage

In its simplest form, you can use the `ConvolverPlayer` component by just providing the `irFilePath` prop. The component will handle the creation of the `AudioContext`.

```vue
<template>
  <ConvolverPlayer :irFilePath="'/path/to/your/ir.wav'" />
</template>

<script setup>
  import { ConvolverPlayer } from '@convolver-player/vue';
</script>
```

##### Advanced Usage: Shared `AudioContext`

For more complex scenarios where you have multiple `ConvolverPlayer` components on a page, it's recommended to use a shared `AudioContext`. This is more efficient as it avoids creating multiple `AudioContext` instances.

```vue
<template>
  <div>
    <ConvolverPlayer :irFilePath="'/path/to/your/ir1.wav'" :audioContext="sharedAudioContext" />
    <ConvolverPlayer :irFilePath="'/path/to/your/ir2.wav'" :audioContext="sharedAudioContext" />
  </div>
</template>

<script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import { ConvolverPlayer } from '@convolver-player/vue';

  const sharedAudioContext = ref(null);

  onMounted(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      sharedAudioContext.value = new AudioContext();
    }
  });

  onUnmounted(() => {
    if (sharedAudioContext.value && sharedAudioContext.value.state !== 'closed') {
      sharedAudioContext.value.close();
    }
  });
</script>
```

#### Styling Guide

The `ConvolverPlayer` component is intentionally unstyled to give you full control over its appearance. You can apply styles using standard CSS, targeting its internal class structure.

Here's an example of how you might style the component, based on the demo application's `App.vue`:

```css
.convolver-player {
  display: grid;
  grid-template-columns: 2fr 5fr;
  column-gap: 1em;
  row-gap: 0;
  padding: 3em;
  margin: 1em 0;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  height: fit-content;
  box-shadow: 0 0 0.95px ButtonBorder; /* Using system color for shadow */
}

.convolver-player .examples {
  display: grid;
  gap: 1em;
  grid-template-columns: 1fr 1fr;
  align-items: center;
}

.convolver-player .examples button {
  height: 100%;
}

.convolver-player .ir {
  display: grid;
  align-items: center;
  row-gap: 0.5em;
}

.convolver-player .ir .info {
  align-content: center;
  height: 32px;
}

.convolver-player .ir .waveform-section .waveform-canvas {
  width: 100%;
  height: 100px;
  background-color: Canvas; /* Using system color for background */
  box-shadow: 0 0 0.95px ButtonBorder; /* Using system color for shadow */
}

.convolver-player .ir .controls {
  display: grid;
  grid-template-columns: auto 1fr auto;
}

/* You can further style elements like labels, input[type="range"], and spans within .controls */
```

#### Props

| Prop           | Type           | Description                                                                                          |
| -------------- | -------------- | ---------------------------------------------------------------------------------------------------- |
| `irFilePath`   | `String`       | The path to the impulse response file.                                                               |
| `audioContext` | `AudioContext` | An optional, pre-existing `AudioContext` to use. If not provided, the component will create its own. |

### `@convolver-player/react`


*   **Location**: `packages/react/react-convolver-player`
*   **Framework**: React
*   **Language**: TypeScript
*   **Build Tool**: Vite
*   **Description**: The React version of the convolver player component, offering a customizable audio convolution experience, built on top of `@convolver-player/core`.

#### Installation

```bash
yarn add @convolver-player/react
```

#### Usage

The `ConvolverPlayer` component is designed to be unstyled by default, giving you complete control over its appearance. You will need to provide your own CSS to style the component. The waveform display will attempt to use the browser's `accent-color` for the waveform, with a fallback to a default blue color if `accent-color` is not available.

##### Simple Usage

In its simplest form, you can use the `ConvolverPlayer` component by just providing the `irFilePath` prop. The component will handle the creation of the `AudioContext`.

```jsx
import React from 'react';
import { ConvolverPlayer } from '@convolver-player/react';

function App() {
  return (
    <ConvolverPlayer irFilePath="/path/to/your/ir.wav" />
  );
}

export default App;
```

##### Advanced Usage: Shared `AudioContext`

For more complex scenarios where you have multiple `ConvolverPlayer` components on a page, it's recommended to use a shared `AudioContext`. This is more efficient as it avoids creating multiple `AudioContext` instances.

```jsx
import React, { useState, useEffect } from 'react';
import { ConvolverPlayer } from '@convolver-player/react';

function App() {
  const [sharedAudioContext, setSharedAudioContext] = useState(null);

  useEffect(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      setSharedAudioContext(new AudioContext());
    }

    return () => {
      if (sharedAudioContext && sharedAudioContext.state !== 'closed') {
        sharedAudioContext.close();
      }
    };
  }, [sharedAudioContext]); // Dependency array includes sharedAudioContext to ensure cleanup runs correctly

  return (
    <div>
      <ConvolverPlayer irFilePath="/path/to/your/ir1.wav" audioContext={sharedAudioContext} />
      <ConvolverPlayer irFilePath="/path/to/your/ir2.wav" audioContext={sharedAudioContext} />
    </div>
  );
}

export default App;
```

#### Styling Guide

The `ConvolverPlayer` component is intentionally unstyled to give you full control over its appearance. You can apply styles using standard CSS, targeting its internal class structure.

Here's an example of how you might style the component, based on the demo application's `App.tsx`:

```css
.convolver-player {
  display: grid;
  grid-template-columns: 2fr 5fr;
  column-gap: 1em;
  row-gap: 0;
  padding: 3em;
  margin: 1em 0;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  height: fit-content;
  box-shadow: 0 0 0.95px ButtonBorder; /* Using system color for shadow */
}

.convolver-player .examples {
  display: grid;
  gap: 1em;
  grid-template-columns: 1fr 1fr;
  align-items: center;
}

.convolver-player .examples button {
  height: 100%;
}

.convolver-player .ir {
  display: grid;
  align-items: center;
  row-gap: 0.5em;
}

.convolver-player .ir .info {
  align-content: center;
  height: 32px;
}

.convolver-player .ir .waveform-section .waveform-canvas {
  width: 100%;
  height: 100px;
  background-color: Canvas; /* Using system color for background */
  box-shadow: 0 0 0.95px ButtonBorder; /* Using system color for shadow */
}

.convolver-player .ir .controls {
  display: grid;
  grid-template-columns: auto 1fr auto;
}

/* You can further style elements like labels, input[type="range"], and spans within .controls */
```

#### Props

| Prop           | Type           | Description                                                                                          |
| -------------- | -------------- | ---------------------------------------------------------------------------------------------------- |
| `irFilePath`   | `string`       | The path to the impulse response file.                                                               |
| `audioContext` | `AudioContext` | An optional, pre-existing `AudioContext` to use. If not provided, the component will create its own. |

## Getting Started

To get started with development, follow these steps:

### 1. Installation

Navigate to the root directory of the monorepo and install all dependencies for all packages:

```bash
yarn install
```

### GitHub Actions CI

This repository uses GitHub Actions to ensure code quality. Pull requests targeting the `main` branch will automatically trigger lint, typecheck, and test workflows.

### 2. Development

To start the development server for a specific UI package, use the `yarn workspace` command. For example, to run the development server for the Vue component:

```bash
yarn workspace @convolver-player/vue dev
```

Or for the React component:

```bash
yarn workspace @convolver-player/react dev
```

This will typically open a local development server (e.g., `http://localhost:5173`) where you can see the component in action and make live changes.

To start development servers for all UI packages simultaneously, run:

```bash
yarn dev
```

### 3. Building

To build a specific package for production, use the `yarn workspace` command with the `build` script. For example, to build the Vue component:

```bash
yarn workspace @convolver-player/vue build
```

Or to build the React component:

```bash
yarn workspace @convolver-player/react build
```

Or to build the core library:

```bash
yarn workspace @convolver-player/core build
```

These commands will compile the respective package into its distributable format.

To build all packages in the monorepo for production, run:

```bash
yarn build
```

### 4. Testing

To run the unit tests for a specific package, use the `yarn workspace` command with the `test:run` script. This will execute all tests once and report the results:

```bash
yarn workspace @convolver-player/vue test:run
```

Or for the React component:

```bash
yarn workspace @convolver-player/react test:run
```

Or for the core library:

```bash
yarn workspace @convolver-player/core test:run
```

To run all unit tests across all packages in the monorepo, run:

```bash
yarn test
```

If you wish to run tests with coverage reporting for a specific package:

```bash
yarn workspace @convolver-player/vue test:run:coverage
```

Or for the React component:

```bash
yarn workspace @convolver-player/react test:run:coverage
```

Or for the core library:

```bash
yarn workspace @convolver-player/core test:run:coverage
```

To run all unit tests with coverage reporting across all packages in the monorepo, run:

```bash
yarn test:coverage
```

## Contributing

Contributions are welcome! If you have ideas for new features, improvements, or bug fixes, please open an issue to discuss them before submitting a pull request. This helps ensure alignment with the project's goals and reduces the chance of duplicated effort.

### How to Contribute:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes, ensuring they adhere to the existing code style and conventions.
4.  Write or update tests as appropriate.
5. Ensure all tests pass (`yarn test`).
6.  Submit a pull request with a clear description of your changes.