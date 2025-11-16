// packages/core/convolver-player-core/src/__tests__/convolverProcessor.spec.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ConvolverProcessor } from "../convolverProcessor";

// Mock AudioContext and its nodes
const mockConvolverNode = {
  connect: vi.fn(),
  disconnect: vi.fn(),
  buffer: null as AudioBuffer | null,
};
const mockBufferSourceNode = {
  connect: vi.fn(),
  disconnect: vi.fn(),
  start: vi.fn(),
  stop: vi.fn(),
  onended: null as (() => void) | null,
  buffer: null as AudioBuffer | null,
};

const mockAudioContext = {
  createGain: vi.fn(() => ({ // Return a new mock GainNode each time
    connect: vi.fn(),
    disconnect: vi.fn(),
    gain: { value: 1 },
  })),
  createConvolver: vi.fn(() => mockConvolverNode),
  createBufferSource: vi.fn(() => mockBufferSourceNode),
  destination: { connect: vi.fn() },
};

// Mock AudioBuffer
const mockIrBuffer = { duration: 0.5 } as AudioBuffer;
const mockSoundBuffer = { duration: 2.0 } as AudioBuffer;

describe("ConvolverProcessor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers(); // Use fake timers for setTimeout/clearTimeout
    vi.spyOn(console, 'warn').mockImplementation(() => {}); // Mock console.warn
    vi.spyOn(window, 'clearTimeout').mockImplementation(() => {}); // Mock window.clearTimeout
    // Reset mock node states
    mockConvolverNode.connect.mockClear();
    mockConvolverNode.disconnect.mockClear();
    mockBufferSourceNode.connect.mockClear();
    mockBufferSourceNode.disconnect.mockClear();
    mockBufferSourceNode.start.mockClear();
    mockBufferSourceNode.stop.mockClear();
    mockBufferSourceNode.onended = null;
    mockBufferSourceNode.buffer = null;
    mockConvolverNode.buffer = null;
    mockAudioContext.createGain.mockClear(); // Clear calls to createGain
  });

  afterEach(() => {
    vi.restoreAllMocks(); // Restore all mocks after each test
    vi.useRealTimers(); // Restore real timers
  });

  it("should initialize with provided AudioContext and IR buffer", () => {
    const processor = new ConvolverProcessor({
      audioContext: mockAudioContext as unknown as AudioContext,
      irBuffer: mockIrBuffer,
    });

    expect(mockAudioContext.createGain).toHaveBeenCalledTimes(2); // wet and dry
    expect(mockAudioContext.createConvolver).toHaveBeenCalledTimes(1);
    expect(mockConvolverNode.buffer).toBe(mockIrBuffer);
    expect(processor).toBeInstanceOf(ConvolverProcessor);
  });

  it("should set wet/dry mix correctly", () => {
    const processor = new ConvolverProcessor({
      audioContext: mockAudioContext as unknown as AudioContext,
      irBuffer: mockIrBuffer,
    });

    // Get the two distinct gain nodes created during initialization
    const wetGainNode = mockAudioContext.createGain.mock.results[0].value;
    const dryGainNode = mockAudioContext.createGain.mock.results[1].value;

    processor.setWetDryMix(0.7);
    expect(wetGainNode.gain.value).toBe(0.7);
    expect(dryGainNode.gain.value).toBeCloseTo(0.3);
  });

  it("should play an audio buffer and connect nodes correctly", async () => {
    const processor = new ConvolverProcessor({
      audioContext: mockAudioContext as unknown as AudioContext,
      irBuffer: mockIrBuffer,
    });

    const playPromise = processor.play(mockSoundBuffer);

    expect(mockAudioContext.createBufferSource).toHaveBeenCalledTimes(1);
    expect(mockBufferSourceNode.buffer).toBe(mockSoundBuffer);
    expect(mockBufferSourceNode.start).toHaveBeenCalledWith(0);

    // Get the two distinct gain nodes created during initialization
    const dryGainNode = mockAudioContext.createGain.mock.results[1].value;
    const wetGainNode = mockAudioContext.createGain.mock.results[0].value;


    // Check connections
    expect(mockBufferSourceNode.connect).toHaveBeenCalledWith(dryGainNode); // dryGainNode
    expect(dryGainNode.connect).toHaveBeenCalledWith(mockAudioContext.destination); // dryGainNode to destination

    expect(mockBufferSourceNode.connect).toHaveBeenCalledWith(mockConvolverNode);
    expect(mockConvolverNode.connect).toHaveBeenCalledWith(wetGainNode); // wetGainNode
    expect(wetGainNode.connect).toHaveBeenCalledWith(mockAudioContext.destination); // wetGainNode to destination

    // Simulate onended
    mockBufferSourceNode.onended?.();
    await playPromise; // Wait for the promise to resolve

    expect(mockBufferSourceNode.disconnect).toHaveBeenCalled();
    expect(dryGainNode.disconnect).toHaveBeenCalled();
    expect(wetGainNode.disconnect).toHaveBeenCalled();
    expect(mockConvolverNode.disconnect).toHaveBeenCalled();
  });

  it("should stop currently playing sound before starting a new one", async () => {
    const processor = new ConvolverProcessor({
      audioContext: mockAudioContext as unknown as AudioContext,
      irBuffer: mockIrBuffer,
    });

    // Start first sound
    processor.play(mockSoundBuffer);
    expect(mockBufferSourceNode.start).toHaveBeenCalledTimes(1);

    // Start second sound
    processor.play(mockSoundBuffer);
    expect(mockBufferSourceNode.stop).toHaveBeenCalledTimes(1);
    expect(mockBufferSourceNode.disconnect).toHaveBeenCalledTimes(1);
    expect(mockBufferSourceNode.start).toHaveBeenCalledTimes(2); // Second sound started
  });

  it("should stop and disconnect all nodes on stop() call", () => {
    const processor = new ConvolverProcessor({
      audioContext: mockAudioContext as unknown as AudioContext,
      irBuffer: mockIrBuffer,
    });

    processor.play(mockSoundBuffer); // Start playing to have active nodes
    processor.stop();

    expect(mockBufferSourceNode.stop).toHaveBeenCalled();
    expect(mockBufferSourceNode.disconnect).toHaveBeenCalled();
    // Get the two distinct gain nodes created during initialization
    const dryGainNode = mockAudioContext.createGain.mock.results[1].value;
    const wetGainNode = mockAudioContext.createGain.mock.results[0].value;
    expect(dryGainNode.disconnect).toHaveBeenCalled();
    expect(wetGainNode.disconnect).toHaveBeenCalled();
    expect(mockConvolverNode.disconnect).toHaveBeenCalled();
    expect(window.clearTimeout).toHaveBeenCalled();
  });

  it("should update IR buffer correctly", () => {
    const processor = new ConvolverProcessor({
      audioContext: mockAudioContext as unknown as AudioContext,
      irBuffer: mockIrBuffer,
    });
    const newIrBuffer = { duration: 1.0 } as AudioBuffer;
    processor.updateIrBuffer(newIrBuffer);
    expect(mockConvolverNode.buffer).toBe(newIrBuffer);
  });

  it("should dispose all nodes on dispose() call", () => {
    const processor = new ConvolverProcessor({
      audioContext: mockAudioContext as unknown as AudioContext,
      irBuffer: mockIrBuffer,
    });

    processor.play(mockSoundBuffer); // Start playing to have active nodes
    processor.dispose();

    expect(mockBufferSourceNode.stop).toHaveBeenCalled();
    expect(mockBufferSourceNode.disconnect).toHaveBeenCalled();
    // Get the two distinct gain nodes created during initialization
    const dryGainNode = mockAudioContext.createGain.mock.results[1].value;
    const wetGainNode = mockAudioContext.createGain.mock.results[0].value;
    expect(dryGainNode.disconnect).toHaveBeenCalled();
    expect(wetGainNode.disconnect).toHaveBeenCalled();
    expect(mockConvolverNode.disconnect).toHaveBeenCalled();
    expect(window.clearTimeout).toHaveBeenCalled();
  });

  it("should clear timeout when sound ends", async () => {
    const processor = new ConvolverProcessor({
      audioContext: mockAudioContext as unknown as AudioContext,
      irBuffer: mockIrBuffer,
    });

    const playPromise = processor.play(mockSoundBuffer);
    mockBufferSourceNode.onended?.(); // Simulate onended
    await playPromise;

    expect(window.clearTimeout).toHaveBeenCalled();
  });

  it("should clear timeout when timeout fires", async () => {
    const processor = new ConvolverProcessor({
      audioContext: mockAudioContext as unknown as AudioContext,
      irBuffer: mockIrBuffer,
    });

    const playPromise = processor.play(mockSoundBuffer);
    vi.advanceTimersByTime((mockSoundBuffer.duration + mockIrBuffer.duration) * 1000 + 500); // Advance past the timeout
    await playPromise;

    expect(window.clearTimeout).toHaveBeenCalled();
  });
});