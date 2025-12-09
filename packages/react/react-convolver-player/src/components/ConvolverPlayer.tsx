import { useRef, useEffect, useState, useCallback } from 'react';
import {
  ConvolverProcessor,
  loadAudioBuffer,
  drawWaveform,
  setupCanvasContext,
  getAccentColor,
} from '@convolver-player/core';
import type { TestSound, ConvolverPlayerProps } from '@convolver-player/core/types';
import PlayIcon from './PlayIcon';

import clickSound from '../assets/sounds/click.wav';
import guitarSound from '../assets/sounds/guitar.wav';
import pianoSound from '../assets/sounds/piano.wav';
import snareSound from '../assets/sounds/snare.wav';

const testSounds: TestSound[] = [
  { label: 'Click', type: 'sample', path: clickSound },
  { label: 'Guitar', type: 'sample', path: guitarSound },
  { label: 'Piano', type: 'sample', path: pianoSound },
  { label: 'Snare', type: 'sample', path: snareSound },
];

const ConvolverPlayer: React.FC<ConvolverPlayerProps> = ({
  irFilePath,
  audioContext: propAudioContext,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const convolverProcessorRef = useRef<ConvolverProcessor | null>(null);
  const localAudioContextRef = useRef<AudioContext | null>(null);
  const [irBuffer, setIrBuffer] = useState<AudioBuffer | null>(null);
  const [irInfo, setIrInfo] = useState<string>('');
  const [isAudioContextReady, setIsAudioContextReady] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // New loading state

  const [wetDryMix, setWetDryMix] = useState<number>(0.75);

  const getAudioContext = useCallback(() => {
    if (propAudioContext) {
      return propAudioContext;
    }
    if (!localAudioContextRef.current) {
      // @ts-expect-error proprietary fallback for Safari
      localAudioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return localAudioContextRef.current;
  }, [propAudioContext]);

  const initializeAudio = useCallback(async () => {
    const audioContext: AudioContext = getAudioContext();
    if (!audioContext) return;
    setIsAudioContextReady(true);
  }, [getAudioContext]);

  useEffect(() => {
    initializeAudio();
    return () => {
      if (localAudioContextRef.current) {
        localAudioContextRef.current.close();
        localAudioContextRef.current = null;
      }
    };
  }, [initializeAudio]);

  // New useEffect for ConvolverProcessor instantiation and updates
  useEffect(() => {
    const audioContext = getAudioContext(); // Get the audio context here
    if (audioContext && irBuffer) {
      if (!convolverProcessorRef.current) {
        convolverProcessorRef.current = new ConvolverProcessor({
          audioContext: audioContext,
          irBuffer: irBuffer,
          wetGainValue: wetDryMix,
        });
      } else {
        convolverProcessorRef.current.updateIrBuffer(irBuffer);
      }
    }

    return () => {
      if (convolverProcessorRef.current) {
        convolverProcessorRef.current.dispose();
        convolverProcessorRef.current = null;
      }
    };
  }, [irBuffer, getAudioContext]);

  // New useEffect for just the mix so sad
  useEffect(() => {
    if (convolverProcessorRef.current) {
      convolverProcessorRef.current.setWetDryMix(wetDryMix);
    }
  }, [wetDryMix]);

  useEffect(() => {
    const currentAudioContext = getAudioContext(); // Get the audio context here

    const loadIr = async () => {
      setIsLoading(true); // Set loading to true at the start
      if (!currentAudioContext || !irFilePath) {
        setIrBuffer(null);
        setIrInfo('');
        if (canvasRef.current) {
          const ctx = setupCanvasContext(canvasRef.current);
          if (ctx) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          }
        }
        setIsLoading(false); // Set loading to false if no context or path
        return;
      }

      try {
        const buffer = await loadAudioBuffer(currentAudioContext, irFilePath);
        setIrBuffer(buffer);
        setIrInfo(
          `Duration: ${buffer.duration.toFixed(2)}s, Sample Rate: ${buffer.sampleRate}Hz, Channels: ${buffer.numberOfChannels}`
        );
        convolverProcessorRef.current?.updateIrBuffer(buffer);
        if (canvasRef.current) {
          const color = getAccentColor(canvasRef.current || document.body);
          const ctx = setupCanvasContext(canvasRef.current);
          if (ctx) {
            drawWaveform(ctx, buffer, ctx.canvas.width, ctx.canvas.height, color);
          }
        }
      } catch (error) {
        console.error('Error loading IR file:', error);
        setIrBuffer(null);
        setIrInfo('Error loading IR');
      } finally {
        setIsLoading(false); // Set loading to false after success or failure
      }
    };

    loadIr();
  }, [irFilePath, getAudioContext]);

  const playTestSound = useCallback(
    async (soundPath: string) => {
      const audioContext = getAudioContext();
      // Resume AudioContext if suspended, as this is a user gesture
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }
      if (!audioContext || !convolverProcessorRef.current || !irBuffer) {
        console.warn('AudioContext, ConvolverProcessor, or IR buffer not ready.');
        return;
      }
      try {
        const soundBuffer = await loadAudioBuffer(audioContext, soundPath);
        convolverProcessorRef.current.play(soundBuffer);
      } catch (error) {
        console.error('Error playing test sound:', error);
      }
    },
    [getAudioContext, irBuffer]
  );

  const handleWetDryMixChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const mix = parseFloat(event.target.value);
    setWetDryMix(mix);
  }, []);

  return (
    <div className="convolver-player" data-testid="convolver-player">
      <div className="convolver-examples">
        {testSounds.map((sound) => (
          <button
            key={sound.label}
            onClick={() => playTestSound(sound.path)}
            disabled={!isAudioContextReady || !irBuffer || isLoading} // Disable buttons while loading
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <PlayIcon />{sound.label}
          </button>
        ))}
      </div>
      <div className="convolver-ir">
        {isLoading ? (
          <span className="convolver-ir-info">Loading Impulse Response...</span>
        ) : (
          <span className="convolver-ir-info">{irInfo}</span>
        )}
        <canvas
          ref={canvasRef}
          width="300"
          height="150"
          className="convolver-waveform-canvas"
        ></canvas>
        <div className="convolver-controls">
          <label htmlFor="wetDryMix">Effect:</label>
          <input
            type="range"
            id="wetDryMix"
            min="0"
            max="1"
            step="0.01"
            value={wetDryMix}
            onChange={handleWetDryMixChange}
            disabled={isLoading} // Disable slider while loading
          />
          <span>{(wetDryMix * 100).toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
};

export default ConvolverPlayer;
