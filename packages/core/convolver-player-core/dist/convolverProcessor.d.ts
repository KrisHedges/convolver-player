export interface ConvolverProcessorOptions {
    audioContext: AudioContext;
    irBuffer: AudioBuffer;
    wetGainValue?: number;
}
export declare class ConvolverProcessor {
    private audioContext;
    private convolverNode;
    private wetGainNode;
    private dryGainNode;
    private irBuffer;
    private activeBufferSource;
    private timeoutId;
    constructor(options: ConvolverProcessorOptions);
    /**
     * Sets the wet/dry mix for the convolver effect.
     * @param wetGainValue A value between 0 and 1, where 1 is 100% wet and 0 is 100% dry.
     */
    setWetDryMix(wetGainValue: number): void;
    /**
     * Plays an AudioBuffer through the convolver effect.
     * @param buffer The AudioBuffer to play.
     * @returns A Promise that resolves when the sound has finished playing and resources are cleaned up.
     */
    play(buffer: AudioBuffer): Promise<void>;
    /**
     * Stops any currently playing sound and disconnects all nodes.
     */
    stop(): void;
    /**
     * Updates the impulse response buffer for the convolver.
     * @param newIrBuffer The new AudioBuffer to use as the impulse response.
     */
    updateIrBuffer(newIrBuffer: AudioBuffer): void;
    /**
     * Disconnects all internal nodes from the audio graph.
     * Should be called when the processor is no longer needed.
     */
    dispose(): void;
}
