/**
 * Manages the creation, resumption, and closing of a Web Audio API AudioContext.
 * It can either use a provided AudioContext or create and manage its own.
 */
export declare class AudioContextManager {
    private localAudioContext;
    private _currentAudioContext;
    constructor(providedAudioContext?: AudioContext | null);
    /**
     * Returns the current AudioContext. If no AudioContext was provided during construction
     * and no local one exists, it attempts to create a new one.
     * @returns The AudioContext instance, or null if not supported.
     */
    getAudioContext(): Promise<AudioContext | null>;
    /**
     * Resumes the AudioContext if it is in a 'suspended' state.
     */
    resumeAudioContext(): Promise<void>;
    /**
     * Closes the locally managed AudioContext if one was created by this manager.
     * Does nothing if an AudioContext was provided externally.
     */
    closeLocalAudioContext(): Promise<void>;
    /**
     * Returns true if the AudioContext is managed locally by this instance, false otherwise.
     */
    isLocalContext(): boolean;
}
