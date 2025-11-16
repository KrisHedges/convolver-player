/**
 * Loads an audio file from a given URL and decodes it into an AudioBuffer.
 * @param audioContext The AudioContext to use for decoding.
 * @param url The URL of the audio file.
 * @returns A Promise that resolves with the decoded AudioBuffer.
 * @throws Error if the fetch fails or audio data cannot be decoded.
 */
export declare function loadAudioBuffer(audioContext: AudioContext, url: string): Promise<AudioBuffer>;
