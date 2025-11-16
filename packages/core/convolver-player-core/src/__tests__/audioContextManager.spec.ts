// packages/core/convolver-player-core/src/__tests__/audioContextManager.spec.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { AudioContextManager } from "../audioContextManager";

// Mock AudioContext and its methods
const mockAudioContext = {
  state: "running",
  resume: vi.fn(() => Promise.resolve()),
  close: vi.fn(() => Promise.resolve()),
  createGain: vi.fn(() => ({
    connect: vi.fn(),
    disconnect: vi.fn(),
    gain: { value: 1 },
  })),
  createBufferSource: vi.fn(() => ({
    connect: vi.fn(),
    disconnect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    onended: null,
    buffer: null,
  })),
  createConvolver: vi.fn(() => ({
    connect: vi.fn(),
    disconnect: vi.fn(),
    buffer: null,
  })),
  decodeAudioData: vi.fn(() => Promise.resolve(new AudioBuffer({ length: 1, sampleRate: 44100 }))),
  destination: { connect: vi.fn() },
};

// Mock window.AudioContext
const mockWindowAudioContext = vi.fn(function () {
  return mockAudioContext;
});
Object.defineProperty(window, "AudioContext", {
  writable: true,
  value: mockWindowAudioContext,
});
Object.defineProperty(window, "webkitAudioContext", {
  writable: true,
  value: mockWindowAudioContext,
});

describe("AudioContextManager", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAudioContext.state = "running"; // Reset state for each test
    vi.spyOn(console, 'error').mockImplementation(() => {}); // Mock console.error
  });

  afterEach(() => {
    vi.restoreAllMocks(); // Restore all mocks after each test
  });

  it("should use provided AudioContext if available", async () => {
    const providedContext = mockAudioContext as unknown as AudioContext;
    const manager = new AudioContextManager(providedContext);
    const context = await manager.getAudioContext();
    expect(context).toBe(providedContext);
    expect(mockWindowAudioContext).not.toHaveBeenCalled();
  });

  it("should create a local AudioContext if none is provided", async () => {
    const manager = new AudioContextManager();
    const context = await manager.getAudioContext();
    expect(context).toBe(mockAudioContext);
    expect(mockWindowAudioContext).toHaveBeenCalledTimes(1);
  });

  it("should resume AudioContext if suspended", async () => {
    mockAudioContext.state = "suspended";
    const manager = new AudioContextManager(mockAudioContext as unknown as AudioContext);
    await manager.resumeAudioContext();
    expect(mockAudioContext.resume).toHaveBeenCalledTimes(1);
  });

  it("should not resume AudioContext if not suspended", async () => {
    const manager = new AudioContextManager(mockAudioContext as unknown as AudioContext);
    await manager.resumeAudioContext();
    expect(mockAudioContext.resume).not.toHaveBeenCalled();
  });

  it("should close local AudioContext if it was created by the manager", async () => {
    const manager = new AudioContextManager();
    await manager.getAudioContext(); // Ensure local context is created
    await manager.closeLocalAudioContext();
    expect(mockAudioContext.close).toHaveBeenCalledTimes(1);
  });

  it("should not close provided AudioContext", async () => {
    const providedContext = mockAudioContext as unknown as AudioContext;
    const manager = new AudioContextManager(providedContext);
    await manager.closeLocalAudioContext();
    expect(mockAudioContext.close).not.toHaveBeenCalled();
  });

  it("should return true for isLocalContext if context is local", async () => {
    const manager = new AudioContextManager();
    await manager.getAudioContext();
    expect(manager.isLocalContext()).toBe(true);
  });

  it("should return false for isLocalContext if context is provided", () => {
    const providedContext = mockAudioContext as unknown as AudioContext;
    const manager = new AudioContextManager(providedContext);
    expect(manager.isLocalContext()).toBe(false);
  });

  it("should handle AudioContext not being supported", async () => {
    Object.defineProperty(window, "AudioContext", { writable: true, value: undefined });
    Object.defineProperty(window, "webkitAudioContext", { writable: true, value: undefined });

    const manager = new AudioContextManager();
    const context = await manager.getAudioContext();
    expect(context).toBeNull();
    expect(console.error).toHaveBeenCalledWith("AudioContext is not supported in this browser.");
  });
});
