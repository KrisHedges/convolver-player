// packages/core/convolver-player-core/src/__tests__/audioLoader.spec.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { loadAudioBuffer } from "../audioLoader";

// Mock AudioContext and its decodeAudioData method
const mockAudioContext = {
  decodeAudioData: vi.fn(),
};

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("loadAudioBuffer", () => {
  const mockUrl = "http://example.com/audio.wav";
  const mockArrayBuffer = new ArrayBuffer(8);
  const mockAudioBuffer = { duration: 1.0 } as AudioBuffer; // Simplified mock AudioBuffer

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {}); // Mock console.error
  });

  afterEach(() => {
    vi.restoreAllMocks(); // Restore all mocks after each test
  });

  it("should load and decode an audio buffer successfully", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      arrayBuffer: () => Promise.resolve(mockArrayBuffer),
    });
    mockAudioContext.decodeAudioData.mockResolvedValueOnce(mockAudioBuffer);

    const result = await loadAudioBuffer(
      mockAudioContext as unknown as AudioContext,
      mockUrl
    );

    expect(mockFetch).toHaveBeenCalledWith(mockUrl);
    expect(mockAudioContext.decodeAudioData).toHaveBeenCalledWith(mockArrayBuffer);
    expect(result).toBe(mockAudioBuffer);
  });

  it("should throw an error if fetch fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(
      loadAudioBuffer(mockAudioContext as unknown as AudioContext, mockUrl)
    ).rejects.toThrow("HTTP error! status: 404 for URL: http://example.com/audio.wav");
    expect(mockAudioContext.decodeAudioData).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });

  it("should throw an error if decodeAudioData fails", async () => {
    const decodeError = new Error("Decoding failed");
    mockFetch.mockResolvedValueOnce({
      ok: true,
      arrayBuffer: () => Promise.resolve(mockArrayBuffer),
    });
    mockAudioContext.decodeAudioData.mockRejectedValueOnce(decodeError);

    await expect(
      loadAudioBuffer(mockAudioContext as unknown as AudioContext, mockUrl)
    ).rejects.toThrow("Decoding failed");
    expect(mockFetch).toHaveBeenCalledWith(mockUrl);
    expect(mockAudioContext.decodeAudioData).toHaveBeenCalledWith(mockArrayBuffer);
    expect(console.error).toHaveBeenCalled();
  });
});
