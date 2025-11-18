# @convolver-player/core

This package contains the core, framework-agnostic logic for the Convolver Player components. It provides functions for audio processing (Web Audio API management, impulse response loading, convolution, gain control) and waveform visualization. This package is designed to be consumed by framework-specific component implementations like `@convolver-player/react` and `@convolver-player/vue`.

## Installation

```bash
npm install @convolver-player/core
```

or

```bash
yarn add @convolver-player/core
```

## API

### `ConvolverProcessor`

A class that encapsulates the Web Audio API logic for creating a convolution reverb effect.

#### `constructor(options: { audioContext: AudioContext, irBuffer: AudioBuffer })`

Creates a new `ConvolverProcessor`.

#### `play(soundBuffer: AudioBuffer)`

Plays the given `soundBuffer` through the convolver.

#### `setWetDryMix(mix: number)`

Sets the wet/dry mix of the convolver. `0` is fully dry, `1` is fully wet.

#### `updateIrBuffer(irBuffer: AudioBuffer)`

Updates the impulse response buffer.

#### `dispose()`

Disconnects all audio nodes and cleans up resources.

### `loadAudioBuffer(audioContext: AudioContext, url: string): Promise<AudioBuffer>`

Loads an audio file from a URL and decodes it into an `AudioBuffer`.

### `drawWaveform(ctx: CanvasRenderingContext2D, buffer: AudioBuffer, width: number, height: number, color: string)`

Draws a waveform of the given `AudioBuffer` onto a canvas.

### `setupCanvasContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D | null`

Sets up a canvas context for drawing, handling high-DPI displays.

### `getAccentColor(element: HTMLElement): string`

Gets the browser's accent color from a given element, with a fallback to a default color.

## Contributing

Contributions are welcome! Please see the [main contributing guide](../../../CONTRIBUTING.md) in the monorepo root.
