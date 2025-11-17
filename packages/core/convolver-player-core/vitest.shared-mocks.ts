import { vi } from "vitest";

// Mock ResizeObserver
class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

vi.stubGlobal("ResizeObserver", ResizeObserverMock);

// Mock HTMLCanvasElement.prototype.getContext
const mockCanvasContext = {
  clearRect: vi.fn(),
  setTransform: vi.fn(),
  beginPath: vi.fn(),
  strokeStyle: "",
  lineWidth: 0,
  lineTo: vi.fn(),
  stroke: vi.fn(),
  measureText: vi.fn(() => ({ width: 10 })), // Added for React component
  fillText: vi.fn(), // Added for React component
  canvas: {
    width: 300,
    height: 150,
    style: {},
    getContext: vi.fn(() => mockCanvasContext),
  },
};

HTMLCanvasElement.prototype.getContext = vi.fn(() => mockCanvasContext);

// Mock HTMLCanvasElement.prototype.getBoundingClientRect
HTMLCanvasElement.prototype.getBoundingClientRect = vi.fn(() => ({
  width: 300,
  height: 150,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  x: 0,
  y: 0,
  toJSON: () => ({}),
}));

// Mock AudioBuffer
export class AudioBufferMock {
  length: number;
  sampleRate: number;
  numberOfChannels: number;
  constructor({ length = 1, sampleRate = 44100, numberOfChannels = 1 } = {}) {
    this.length = length;
    this.sampleRate = sampleRate;
    this.numberOfChannels = numberOfChannels;
  }
  getChannelData = vi.fn((channel: number) => {
    if (channel === 0) {
      return new Float32Array(this.length).fill(0.5); // Return dummy data
    }
    return new Float32Array(this.length);
  });
  duration = 0.1; // Add a dummy duration
}
vi.stubGlobal("AudioBuffer", AudioBufferMock);

// Mock AudioContext
export class MockAudioContext {
  _state = 'running'; // Use an internal property

  constructor() {
    Object.defineProperty(this, 'state', {
      get: () => this._state,
      set: (value) => { this._state = value; },
      configurable: true, // Allow redefinition
    });
  }
  decodeAudioData = vi.fn(() =>
    Promise.resolve(new AudioBufferMock({ length: 1, sampleRate: 44100 }))
  );
  createBufferSource = vi.fn(() => ({
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    disconnect: vi.fn(),
  }));
  createConvolver = vi.fn(() => ({
    connect: vi.fn(),
    disconnect: vi.fn(),
    buffer: null,
  }));
  createGain = vi.fn(() => ({
    connect: vi.fn(),
    disconnect: vi.fn(),
    gain: {
      value: 0,
    },
  }));
  destination = {};
  resume = vi.fn(() => Promise.resolve()); // Ensure it returns a Promise
  close = vi.fn(() => Promise.resolve()); // Ensure it returns a Promise
}

vi.stubGlobal("AudioContext", MockAudioContext);
vi.stubGlobal("webkitAudioContext", MockAudioContext);

// Mock fetch to return a mocked Response object
global.fetch = vi.fn((input: RequestInfo | URL) => {
  const url = typeof input === "string" ? input : input.url;
  // Simulate a successful response for any audio file
  if (url.endsWith(".wav")) {
    return Promise.resolve({
      ok: true,
      status: 200,
      arrayBuffer: vi.fn(() => Promise.resolve(new ArrayBuffer(8))), // Return a dummy ArrayBuffer
    } as Response);
  }
  // For other requests, you might want to use the original fetch or throw an error
  return Promise.reject(new Error(`Unhandled fetch request for: ${url}`));
});