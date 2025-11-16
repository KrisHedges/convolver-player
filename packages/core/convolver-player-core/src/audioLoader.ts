// packages/core/convolver-player-core/src/audioLoader.ts

/**
 * Loads an audio file from a given URL and decodes it into an AudioBuffer.
 * @param audioContext The AudioContext to use for decoding.
 * @param url The URL of the audio file.
 * @returns A Promise that resolves with the decoded AudioBuffer.
 * @throws Error if the fetch fails or audio data cannot be decoded.
 */
export async function loadAudioBuffer(
  audioContext: AudioContext,
  url: string
): Promise<AudioBuffer> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} for URL: ${url}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
  } catch (error) {
    console.error(`Error loading or decoding audio from ${url}:`, error);
    throw error;
  }
}
