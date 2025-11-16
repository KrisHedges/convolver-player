// packages/core/convolver-player-core/src/convolverProcessor.ts

import { loadAudioBuffer } from "./audioLoader";

export interface ConvolverProcessorOptions {
  audioContext: AudioContext;
  irBuffer: AudioBuffer;
  wetGainValue?: number;
}

export class ConvolverProcessor {
  private audioContext: AudioContext;
  private convolverNode: ConvolverNode;
  private wetGainNode: GainNode;
  private dryGainNode: GainNode;
  private irBuffer: AudioBuffer;

  private activeBufferSource: AudioBufferSourceNode | null = null;
  private timeoutId: number | null = null;

  constructor(options: ConvolverProcessorOptions) {
    this.audioContext = options.audioContext;
    this.irBuffer = options.irBuffer;
    this.wetGainNode = this.audioContext.createGain();
    this.dryGainNode = this.audioContext.createGain();
    this.convolverNode = this.audioContext.createConvolver();

    // Connect the main processing chain
    this.dryGainNode.connect(this.audioContext.destination);
    this.convolverNode.connect(this.wetGainNode);
    this.wetGainNode.connect(this.audioContext.destination);

    this.convolverNode.buffer = this.irBuffer;
    this.setWetDryMix(options.wetGainValue ?? 1); // Default to 100% wet
  }

  /**
   * Sets the wet/dry mix for the convolver effect.
   * @param wetGainValue A value between 0 and 1, where 1 is 100% wet and 0 is 100% dry.
   */
  public setWetDryMix(wetGainValue: number): void {
    this.wetGainNode.gain.value = wetGainValue;
    this.dryGainNode.gain.value = 1 - wetGainValue;
  }

  /**
   * Plays an AudioBuffer through the convolver effect.
   * @param buffer The AudioBuffer to play.
   * @returns A Promise that resolves when the sound has finished playing and resources are cleaned up.
   */
  public async play(buffer: AudioBuffer): Promise<void> {
    // Stop any currently playing sound and clean up
    this.stop();

    const bufferSource = this.audioContext.createBufferSource();
    bufferSource.buffer = buffer;
    this.activeBufferSource = bufferSource;

    // Connect graph: source -> dryGain
    //              source -> convolver
    bufferSource.connect(this.dryGainNode);
    bufferSource.connect(this.convolverNode);

    bufferSource.start(0);

    return new Promise((resolve) => {
      bufferSource.onended = () => {
        this.stop();
        resolve();
      };

      // Set a timeout for cleanup in case onended doesn't fire or for very long IRs
      const totalDuration = buffer.duration + this.irBuffer.duration;
      this.timeoutId = window.setTimeout(() => {
        this.stop();
        resolve();
      }, totalDuration * 1000 + 500); // Add a small buffer
    });
  }

  /**
   * Stops any currently playing sound and disconnects only the active buffer source.
   */
  public stop(): void {
    if (this.timeoutId !== null) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }

    if (this.activeBufferSource) {
      try {
        this.activeBufferSource.stop();
        this.activeBufferSource.disconnect();
      } catch (e) {
        console.warn("Could not stop/disconnect previous buffer source:", e);
      }
      this.activeBufferSource = null;
    }
  }

  /**
   * Updates the impulse response buffer for the convolver.
   * @param newIrBuffer The new AudioBuffer to use as the impulse response.
   */
  public updateIrBuffer(newIrBuffer: AudioBuffer): void {
    this.irBuffer = newIrBuffer;
    this.convolverNode.buffer = this.irBuffer;
  }

  /**
   * Disconnects all internal nodes from the audio graph.
   * Should be called when the processor is no longer needed.
   */
  public dispose(): void {
    this.stop();
    this.convolverNode.disconnect();
    this.wetGainNode.disconnect();
    this.dryGainNode.disconnect();
  }
}
