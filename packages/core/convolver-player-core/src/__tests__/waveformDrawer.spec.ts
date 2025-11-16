// packages/core/convolver-player-core/src/__tests__/waveformDrawer.spec.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { drawWaveform, setupCanvasContext, getAccentColor } from "../waveformDrawer";

// Mock CanvasRenderingContext2D
const mockCtx = {
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  setTransform: vi.fn(),
  strokeStyle: "",
  lineWidth: 0,
};

// Mock HTMLCanvasElement
const mockCanvas = {
  getContext: vi.fn((contextType: string) => {
    if (contextType === "2d") {
      return mockCtx;
    }
    return null;
  }),
  getBoundingClientRect: vi.fn(() => ({
    width: 100,
    height: 50,
  })),
  width: 0,
  height: 0,
};

// Mock AudioBuffer
const mockAudioBuffer = {
  getChannelData: vi.fn(() => new Float32Array([0.1, 0.5, -0.2, -0.8, 0.3, 0.9, -0.1, -0.5])),
  numberOfChannels: 1,
  sampleRate: 44100,
  length: 8,
};

describe("waveformDrawer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'devicePixelRatio', 'get').mockReturnValue(1); // Default DPR to 1
    // Reset mockCtx properties
    mockCtx.strokeStyle = "";
    mockCtx.lineWidth = 0;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("drawWaveform", () => {
    it("should clear canvas and draw waveform", () => {
      drawWaveform(
        mockCtx as unknown as CanvasRenderingContext2D,
        mockAudioBuffer as unknown as AudioBuffer,
        100,
        50,
        "blue"
      );

      expect(mockCtx.clearRect).toHaveBeenCalledWith(0, 0, 100, 50);
      expect(mockCtx.beginPath).toHaveBeenCalled();
      expect(mockCtx.strokeStyle).toBe("blue");
      expect(mockCtx.lineWidth).toBe(1.5);
      expect(mockCtx.lineTo).toHaveBeenCalled(); // Should have called lineTo multiple times
      expect(mockCtx.stroke).toHaveBeenCalled();
      expect(mockAudioBuffer.getChannelData).toHaveBeenCalledWith(0);
    });

    it("should handle empty audio buffer gracefully", () => {
      const emptyBuffer = {
        getChannelData: vi.fn(() => new Float32Array([])),
        numberOfChannels: 1,
        sampleRate: 44100,
        length: 0,
      };

      drawWaveform(
        mockCtx as unknown as CanvasRenderingContext2D,
        emptyBuffer as unknown as AudioBuffer,
        100,
        50,
        "red"
      );

      expect(mockCtx.clearRect).toHaveBeenCalledWith(0, 0, 100, 50);
      expect(mockCtx.beginPath).toHaveBeenCalled();
      expect(mockCtx.strokeStyle).toBe("red");
      expect(mockCtx.stroke).toHaveBeenCalled();
      expect(mockCtx.lineTo).toHaveBeenCalled(); // Should draw a flat line at the center
    });

    it("should handle buffer with all zero data", () => {
      const zeroBuffer = {
        getChannelData: vi.fn(() => new Float32Array([0, 0, 0, 0])),
        numberOfChannels: 1,
        sampleRate: 44100,
        length: 4,
      };

      drawWaveform(
        mockCtx as unknown as CanvasRenderingContext2D,
        zeroBuffer as unknown as AudioBuffer,
        100,
        50,
        "green"
      );

      expect(mockCtx.clearRect).toHaveBeenCalledWith(0, 0, 100, 50);
      expect(mockCtx.beginPath).toHaveBeenCalled();
      expect(mockCtx.strokeStyle).toBe("green");
      expect(mockCtx.stroke).toHaveBeenCalled();
      expect(mockCtx.lineTo).toHaveBeenCalled(); // Should draw a flat line
    });
  });

  describe("setupCanvasContext", () => {
    it("should set up canvas for high-DPI and return context", () => {
      vi.spyOn(window, 'devicePixelRatio', 'get').mockReturnValue(2); // Simulate high DPR

      const resultCtx = setupCanvasContext(mockCanvas as unknown as HTMLCanvasElement);

      expect(mockCanvas.getContext).toHaveBeenCalledWith("2d");
      expect(mockCanvas.getBoundingClientRect).toHaveBeenCalled();
      expect(mockCanvas.width).toBe(200); // 100 * 2
      expect(mockCanvas.height).toBe(100); // 50 * 2
      expect(mockCtx.setTransform).toHaveBeenCalledWith(2, 0, 0, 2, 0, 0);
      expect(resultCtx).toBe(mockCtx);
    });

    it("should return null if getContext returns null", () => {
      mockCanvas.getContext.mockReturnValueOnce(null);
      const resultCtx = setupCanvasContext(mockCanvas as unknown as HTMLCanvasElement);
      expect(resultCtx).toBeNull();
    });
  });

  describe("getAccentColor", () => {
    it("should return computed accent-color if available", () => {
      const mockElement = {
        style: {
          accentColor: "purple", // This won't be used by getComputedStyle
        },
      } as unknown as HTMLElement;

      // Mock getComputedStyle
      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        getPropertyValue: vi.fn((prop) => {
          if (prop === "accent-color") return "rgb(128, 0, 128)";
          return "";
        }),
      } as unknown as CSSStyleDeclaration);

      const color = getAccentColor(mockElement);
      expect(color).toBe("rgb(128, 0, 128)");
    });

    it("should return fallback color if accent-color is not available", () => {
      const mockElement = {} as HTMLElement;

      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        getPropertyValue: vi.fn(() => ""), // No accent-color
      } as unknown as CSSStyleDeclaration);

      const color = getAccentColor(mockElement, "orange");
      expect(color).toBe("orange");
    });

    it("should return default fallback color if accent-color is not available and no fallback is provided", () => {
      const mockElement = {} as HTMLElement;

      vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        getPropertyValue: vi.fn(() => ""), // No accent-color
      } as unknown as CSSStyleDeclaration);

      const color = getAccentColor(mockElement);
      expect(color).toBe("#007aff");
    });
  });
});
