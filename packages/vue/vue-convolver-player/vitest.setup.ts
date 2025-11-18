import { vi } from 'vitest';
import { MockAudioContext, AudioBufferMock } from '../../core/convolver-player-core/vitest.shared-mocks';

// Re-stub globals using the imported mocks
vi.stubGlobal('AudioContext', MockAudioContext);
vi.stubGlobal('webkitAudioContext', MockAudioContext);
vi.stubGlobal('AudioBuffer', AudioBufferMock);

// Mock ResizeObserver (if not already in shared mocks)
class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}
vi.stubGlobal('ResizeObserver', ResizeObserverMock);

// Mock HTMLCanvasElement.prototype.getContext (if not already in shared mocks)
const mockCanvasContext = {
  clearRect: vi.fn(),
  setTransform: vi.fn(),
  beginPath: vi.fn(),
  strokeStyle: '',
  lineWidth: 0,
  lineTo: vi.fn(),
  stroke: vi.fn(),
  measureText: vi.fn(() => ({ width: 10 })),
  fillText: vi.fn(),
  canvas: {
    width: 300,
    height: 150,
    style: {},
    getContext: vi.fn(() => mockCanvasContext),
  },
};
HTMLCanvasElement.prototype.getContext = vi.fn(() => mockCanvasContext);

// Mock HTMLCanvasElement.prototype.getBoundingClientRect (if not already in shared mocks)
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

// Mock fetch to return a mocked Response object (if not already in shared mocks)
global.fetch = vi.fn((input: RequestInfo | URL) => {
  const url = typeof input === 'string' ? input : input.url;
  if (url.endsWith('.wav')) {
    return Promise.resolve({
      ok: true,
      status: 200,
      arrayBuffer: vi.fn(() => Promise.resolve(new ArrayBuffer(8))),
    } as Response);
  }
  return Promise.reject(new Error(`Unhandled fetch request for: ${url}`));
});

export { MockAudioContext, AudioBufferMock };
