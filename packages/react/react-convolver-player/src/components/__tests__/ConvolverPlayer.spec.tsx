import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ConvolverPlayer from '../ConvolverPlayer';
import {
  MockAudioContext,
} from '../../../vitest.setup'; // Import the mock classes

// Define mockCanvasContext once at the top level
const mockCanvasContext = {
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  canvas: { width: 300, height: 150 },
} as unknown as CanvasRenderingContext2D;

vi.mock('@convolver-player/core', async (importOriginal) => {
  const actual = await importOriginal();

  let shouldThrowError = false;
  const loadAudioBuffer = vi.fn(async (audioContext: AudioContext, path) => {
    if (shouldThrowError && path === '/error-ir.wav') {
      throw new Error('Failed to load audio buffer');
    }
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate loading delay
    // Simulate loading an audio buffer and call decodeAudioData
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffer = new (window.AudioBuffer as any)({ length: 44100, sampleRate: 44100 });
    await audioContext.decodeAudioData(new ArrayBuffer(8)); // Call the mocked decodeAudioData
    return buffer;
  });

  // Expose a way to control the mock's behavior
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (loadAudioBuffer as any)._setShouldThrowError = (value: boolean) => {
    shouldThrowError = value;
  };



  return {
    ...actual,
    loadAudioBuffer,
    drawWaveform: vi.fn((_canvasContext, _buffer, _color) => {
      mockCanvasContext.clearRect(0, 0, mockCanvasContext.canvas.width, mockCanvasContext.canvas.height);
      mockCanvasContext.beginPath();
      mockCanvasContext.lineTo(0, 0);
      mockCanvasContext.stroke();
    }),
    setupCanvasContext: vi.fn(() => mockCanvasContext),
    getAccentColor: vi.fn(() => '#000000'),
    ConvolverProcessor: vi.fn().mockImplementation(function(this: unknown, _options: unknown) {
      this.updateIrBuffer = vi.fn();
      this.setWetDryMix = vi.fn();
      this.play = vi.fn();
      this.dispose = vi.fn();
    }),
  };
});

// Import the mocked functions from the core module
import {
  loadAudioBuffer,
  drawWaveform,
  ConvolverProcessor,
} from '@convolver-player/core';

describe('ConvolverPlayer', () => {
  type MockConvolverProcessorInstance = {
    updateIrBuffer: vi.Mock;
    setWetDryMix: vi.Mock;
    play: vi.Mock;
    dispose: vi.Mock;
  };
  let mockAudioContextInstance: MockAudioContext;
  // mockCanvasContext is now a const at the top level

  beforeEach(() => {
    vi.clearAllMocks(); // This will reset the spies on mockCanvasContext
    mockAudioContextInstance = new MockAudioContext();
    // Spy on methods of the *instance*
    vi.spyOn(mockAudioContextInstance, 'decodeAudioData');
    vi.spyOn(mockAudioContextInstance, 'createBufferSource');
    vi.spyOn(mockAudioContextInstance, 'createConvolver');
    vi.spyOn(mockAudioContextInstance, 'createGain');
    vi.spyOn(mockAudioContextInstance, 'resume');
    vi.spyOn(mockAudioContextInstance, 'close');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (loadAudioBuffer as any)._setShouldThrowError(false); // Ensure mock is reset before each test
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (loadAudioBuffer as any)._setShouldThrowError(false); // Ensure mock is reset after each test
  });

  it('displays a loading message while the IR is being loaded', async () => {
    render(<ConvolverPlayer irFilePath="/test-ir.wav" />);
    expect(screen.getByText(/Loading Impulse Response.../i)).toBeInTheDocument();
    await waitFor(() => expect(loadAudioBuffer).toHaveBeenCalled());
    await waitFor(() => expect(screen.queryByText(/Loading Impulse Response.../i)).not.toBeInTheDocument());
  });

  it('displays an error message when IR loading fails', async () => {
    const originalConsoleError = console.error;
    console.error = vi.fn(); // Temporarily suppress console.error

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (loadAudioBuffer as any)._setShouldThrowError(true); // Configure mock to throw error
    render(<ConvolverPlayer irFilePath="/error-ir.wav" />);

    await waitFor(() => {
      expect(loadAudioBuffer).toHaveBeenCalledWith(mockAudioContextInstance, '/error-ir.wav');
      expect(screen.getByText(/Error loading IR/i)).toBeInTheDocument();
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (loadAudioBuffer as any)._setShouldThrowError(false); // Reset mock behavior
    console.error = originalConsoleError; // Restore original console.error
  });

  it('renders properly', async () => {
    render(<ConvolverPlayer irFilePath="/ir.wav" />);
    expect(screen.getByTestId('convolver-player')).toBeInTheDocument();
    await waitFor(() => expect(loadAudioBuffer).toHaveBeenCalledWith(mockAudioContextInstance, '/ir.wav'));
  });

  it('loads the impulse response from irFilePath', async () => {
    const irFilePath = '/test-ir.wav';
    render(<ConvolverPlayer irFilePath={irFilePath} />);

    await waitFor(() => {
      expect(loadAudioBuffer).toHaveBeenCalledWith(mockAudioContextInstance, irFilePath);
      expect(mockAudioContextInstance.decodeAudioData).toHaveBeenCalled();
      expect(screen.getByText(/Duration: \d+\.\d{2}s/)).toBeInTheDocument();
      expect(drawWaveform).toHaveBeenCalled();
    });
  });

  it('plays a test sound when a button is clicked', async () => {
    const irFilePath = '/test-ir.wav';
    render(<ConvolverPlayer irFilePath={irFilePath} />);

    await waitFor(() => expect(loadAudioBuffer).toHaveBeenCalledWith(mockAudioContextInstance, irFilePath));

    await waitFor(() => expect(loadAudioBuffer).toHaveBeenCalledWith(mockAudioContextInstance, irFilePath));

    // Wait for the ConvolverProcessor instance to be created
    let convolverProcessorInstance: MockConvolverProcessorInstance;
    await waitFor(() => {
      expect(ConvolverProcessor.mock.instances.length).toBeGreaterThan(0);
      convolverProcessorInstance = ConvolverProcessor.mock.instances[0];
      expect(convolverProcessorInstance).toBeDefined();
    });

    const playButton = screen.getByRole('button', { name: /Click/i });
    await userEvent.click(playButton);

    await waitFor(() => {
      expect(loadAudioBuffer).toHaveBeenCalledWith(mockAudioContextInstance, expect.stringContaining('click.wav'));
      expect(convolverProcessorInstance.play).toHaveBeenCalled(); // Use the retrieved instance
    });
  });

  it('uses the provided audioContext prop', async () => {
    const irFilePath = '/test-ir.wav';
    const providedAudioContext = new MockAudioContext();
    const spyOnAudioContextConstructor = vi.spyOn(window, 'AudioContext');

    render(<ConvolverPlayer irFilePath={irFilePath} audioContext={providedAudioContext} />);

    await waitFor(() => {
      // Expect the global AudioContext constructor NOT to be called
      expect(spyOnAudioContextConstructor).not.toHaveBeenCalled();
      // Expect decodeAudioData to be called on the provided audioContext
      expect(providedAudioContext.decodeAudioData).toHaveBeenCalled();
    });
  });

  it('updates wet and dry gain values when slider changes', async () => {
    const irFilePath = '/test-ir.wav';
    render(<ConvolverPlayer irFilePath={irFilePath} />);

    await waitFor(() => expect(loadAudioBuffer).toHaveBeenCalledWith(mockAudioContextInstance, irFilePath));

    // Simulate a click on the first test sound button to ensure ConvolverProcessor is initialized
    const playButton = screen.getByRole('button', { name: /Click/i });
    await userEvent.click(playButton);

    // Wait for the ConvolverProcessor instance to be created
    let convolverProcessorInstance: MockConvolverProcessorInstance;
    await waitFor(() => {
      expect(ConvolverProcessor.mock.instances.length).toBeGreaterThan(0);
      convolverProcessorInstance = ConvolverProcessor.mock.instances[0];
      expect(convolverProcessorInstance).toBeDefined();
    });

    const slider = screen.getByLabelText(/Effect:/i);
    fireEvent.change(slider, { target: { value: '0.25' } });

    await waitFor(() => {
      expect(convolverProcessorInstance.setWetDryMix).toHaveBeenCalledWith(0.25);
    });
  });

  it('displays IR information after loading', async () => {
    const irFilePath = '/test-ir.wav';
    render(<ConvolverPlayer irFilePath={irFilePath} />);

    await waitFor(() => {
      // Check if the IR information is displayed
      expect(screen.getByText(/Duration: \d+\.\d{2}s/)).toBeInTheDocument();
      expect(screen.getByText(/Sample Rate: \d+Hz/)).toBeInTheDocument();
      expect(screen.getByText(/Channels: \d+/)).toBeInTheDocument();
    });
  });

  it('draws the waveform after loading', async () => {
    const irFilePath = '/test-ir.wav';
    render(<ConvolverPlayer irFilePath={irFilePath} />);

    await waitFor(() => {
      expect(drawWaveform).toHaveBeenCalled();
      expect(mockCanvasContext.clearRect).toHaveBeenCalled();
      expect(mockCanvasContext.beginPath).toHaveBeenCalled();
      expect(mockCanvasContext.lineTo).toHaveBeenCalled();
      expect(mockCanvasContext.stroke).toHaveBeenCalled();
    });
  });

  it('calls dispose on ConvolverProcessor when unmounted', async () => {
    const { unmount } = render(<ConvolverPlayer irFilePath="/test-ir.wav" />);

    // Wait for the ConvolverProcessor instance to be created
    let convolverProcessorInstance: MockConvolverProcessorInstance;
    await waitFor(() => {
      expect(ConvolverProcessor.mock.instances.length).toBeGreaterThan(0);
      convolverProcessorInstance = ConvolverProcessor.mock.instances[0];
      expect(convolverProcessorInstance).toBeDefined();
    });

    unmount();

    expect(convolverProcessorInstance.dispose).toHaveBeenCalled();
  });
});
