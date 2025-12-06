export class ConvolverProcessor {
    audioContext;
    convolverNode; // Reintroduce as class property
    irBuffer;
    wetGain; // Persistent wet gain node
    dryGain; // Persistent dry gain node
    timeoutId = null;
    constructor(options) {
        this.audioContext = options.audioContext;
        this.irBuffer = options.irBuffer;
        this.convolverNode = this.audioContext.createConvolver(); // Initialize here
        this.convolverNode.buffer = this.irBuffer; // Set buffer here
        this.wetGain = this.audioContext.createGain();
        this.dryGain = this.audioContext.createGain();
        // Connect persistent nodes to destination
        this.wetGain.connect(this.audioContext.destination);
        this.dryGain.connect(this.audioContext.destination);
        // Set initial mix to 100% wet if not provided, or use provided value
        this.setWetDryMix(options.wetGainValue !== undefined ? options.wetGainValue : 1);
    }
    async play(buffer) {
        // Stop any currently playing sound and clean up
        this.stop();
        const bufferSource = this.audioContext.createBufferSource();
        bufferSource.buffer = buffer;
        // Connect graph: source -> dryGain -> destination
        //              source -> convolver -> wetGain -> destination
        bufferSource.connect(this.dryGain); // Connect to persistent dryGain
        bufferSource.connect(this.convolverNode); // Connect to persistent convolverNode
        this.convolverNode.connect(this.wetGain); // Connect to persistent wetGain
        const scheduledStopTime = this.audioContext.currentTime + buffer.duration + this.irBuffer.duration + 0.5;
        bufferSource.start(0);
        bufferSource.stop(scheduledStopTime); // Schedule stop after convolution tail
        return new Promise((resolve) => {
            const totalDuration = buffer.duration + this.irBuffer.duration;
            const timeoutDelay = totalDuration * 1000 + 500;
            this.timeoutId = window.setTimeout(() => {
                // wetGain and dryGain are persistent, only disconnect convolverNode
                this.convolverNode.disconnect(); // Disconnect persistent convolverNode
                this.timeoutId = null;
                resolve();
            }, timeoutDelay);
        });
    } // Closing brace for the play method
    stop() {
        if (this.timeoutId !== null) {
            window.clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
        // activeBufferSource is stopped by scheduled stop, just clear reference
    }
    /**
     * Updates the impulse response buffer for the convolver.
     * @param newIrBuffer The new AudioBuffer to use as the impulse response.
     */
    updateIrBuffer(newIrBuffer) {
        this.irBuffer = newIrBuffer;
        this.convolverNode.buffer = this.irBuffer;
    }
    /**
     * Sets the wet/dry mix for the convolver effect.
     * @param wetGainValue A value between 0 (100% dry) and 1 (100% wet).
     */
    setWetDryMix(wetGainValue) {
        this.wetGain.gain.value = wetGainValue;
        this.dryGain.gain.value = 1 - wetGainValue;
    }
    dispose() {
        this.stop();
        this.convolverNode.disconnect(); // Disconnect persistent convolverNode
        this.wetGain.disconnect(); // Disconnect persistent wetGain
        this.dryGain.disconnect(); // Disconnect persistent dryGain
    }
}
