export interface ConvolverProcessorOptions {
    audioContext: AudioContext;
    irBuffer: AudioBuffer;
    wetGainValue?: number;
}
export declare class ConvolverProcessor {
    private audioContext;
    private convolverNode;
    private irBuffer;
    private wetGain;
    private dryGain;
    private activeBufferSource;
    private timeoutId;
    constructor(options: ConvolverProcessorOptions);
    play(buffer: AudioBuffer, wetGainValue?: number): Promise<void>;
    stop(): void;
    /**
     * Updates the impulse response buffer for the convolver.
     * @param newIrBuffer The new AudioBuffer to use as the impulse response.
     */
    updateIrBuffer(newIrBuffer: AudioBuffer): void;
    /**
     * Sets the wet/dry mix for the convolver effect.
     * @param wetGainValue A value between 0 (100% dry) and 1 (100% wet).
     */
    setWetDryMix(wetGainValue: number): void;
    dispose(): void;
}
