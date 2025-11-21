# @convolver-player/react

[![npm version](https://img.shields.io/npm/v/@convolver-player/react.svg)](https://www.npmjs.com/package/@convolver-player/react)
[![npm downloads](https://img.shields.io/npm/dm/@convolver-player/react.svg)](https://www.npmjs.com/package/@convolver-player/react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A React component for playing audio through a convolution reverb.

## Installation

```bash
npm install @convolver-player/react
```

or

```bash
yarn add @convolver-player/react
```

> [!NOTE]
> The `@convolver-player/core` package is bundled with this component and does not need to be installed separately.

## Usage

The `ConvolverPlayer` component is designed to be unstyled by default, giving you complete control over its appearance. You will need to provide your own CSS to style the component. The waveform display will attempt to use the browser's `accent-color` for the waveform, with a fallback to a default blue color if `accent-color` is not available.

### Simple Usage

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

### Advanced Usage: Shared `AudioContext`

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

## Styling Guide

The `ConvolverPlayer` component is intentionally unstyled to give you full control over its appearance. You can apply styles using standard CSS, targeting its internal class structure.

Here's an example of how you might style the component:

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

## Props

| Prop           | Type           | Description                                                                                          |
| -------------- | -------------- | ---------------------------------------------------------------------------------------------------- |
| `irFilePath`   | `string`       | The path to the impulse response file.                                                               |
| `audioContext` | `AudioContext` | An optional, pre-existing `AudioContext` to use. If not provided, the component will create its own. |

## Contributing

Contributions are welcome! Please see the [main contributing guide](../../../CONTRIBUTING.md) in the monorepo root.