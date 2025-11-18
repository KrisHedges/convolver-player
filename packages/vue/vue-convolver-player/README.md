# @convolver-player/vue

[![npm version](https://img.shields.io/npm/v/@convolver-player/vue.svg)](https://www.npmjs.com/package/@convolver-player/vue)
[![npm downloads](https://img.shields.io/npm/dm/@convolver-player/vue.svg)](https://www.npmjs.com/package/@convolver-player/vue)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Vue component for playing audio through a convolution reverb.

## Installation

```bash
npm install @convolver-player/vue
```

or

```bash
yarn add @convolver-player/vue
```

## Usage

The `ConvolverPlayer` component is designed to be unstyled by default, giving you complete control over its appearance. You will need to provide your own CSS to style the component. The waveform display will attempt to use the browser's `accent-color` for the waveform, with a fallback to a default blue color if `accent-color` is not available.

### Simple Usage

In its simplest form, you can use the `ConvolverPlayer` component by just providing the `irFilePath` prop. The component will handle the creation of the `AudioContext`.

```vue
<template>
  <ConvolverPlayer :irFilePath="'/path/to/your/ir.wav'" />
</template>

<script setup>
  import { ConvolverPlayer } from '@convolver-player/vue';
</script>
```

### Advanced Usage: Shared `AudioContext`

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
| `irFilePath`   | `String`       | The path to the impulse response file.                                                               |
| `audioContext` | `AudioContext` | An optional, pre-existing `AudioContext` to use. If not provided, the component will create its own. |

## Contributing

Contributions are welcome! Please see the [main contributing guide](../../../CONTRIBUTING.md) in the monorepo root.
