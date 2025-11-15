# @convolver-player/vue

A Vue component for playing audio through a convolution reverb.

## Installation

```bash
yarn add @convolver-player/vue
```

## Usage

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

## Props

| Prop           | Type          | Description                                                                                             |
| -------------- | ------------- | ------------------------------------------------------------------------------------------------------- |
| `irFilePath`   | `String`      | The path to the impulse response file.                                                                  |
| `audioContext` | `AudioContext`| An optional, pre-existing `AudioContext` to use. If not provided, the component will create its own. |