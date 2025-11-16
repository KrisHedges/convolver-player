import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  loadAudioBuffer,
  ConvolverProcessor,
  drawWaveform,
  setupCanvasContext,
  getAccentColor,
} from '@convolver-player/core';

interface TestSound {
  label: string;
  type: 'sample';
  path: string;
}

interface Props {
  irFilePath: string;
  audioContext?: AudioContext | null;
  testSounds: TestSound[];
}

const ConvolverPlayer: React.FC<Props> = ({ irFilePath, audioContext: providedAudioContext, testSounds }) => {
  const convolverProcessor = useRef<ConvolverProcessor | null>(null);
  const [localAudioContext, setLocalAudioContext] = useState<AudioContext | null>(null);
  const [irBuffer, setIrBuffer] = useState<AudioBuffer | null>(null);
  const waveformCanvas = useRef<HTMLCanvasElement | null>(null);
  const [wetGainValue, setWetGainValue] = useState<number>(1);

  const displayedWetGain = `${(wetGainValue * 100).toFixed(0)}%`;

  const loadIR = useCallback(async (path: string, audioContext: AudioContext) => {
    try {
      const buffer = await loadAudioBuffer(audioContext, path);
      setIrBuffer(buffer);
    } catch (error) {
      console.error('Error loading IR:', error);
      setIrBuffer(null);
    }
  }, []);

  const playTestSound = useCallback(async (soundConfig: TestSound) => {
    const audioContext = providedAudioContext || localAudioContext;

    if (!audioContext || !convolverProcessor.current) {
      console.warn('AudioContext or ConvolverProcessor not initialized.');
      return;
    }

    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    if (!irBuffer) {
      console.warn('IR not ready.');
      return;
    }

    try {
      const testBuffer = await loadAudioBuffer(audioContext, soundConfig.path);
      await convolverProcessor.current.play(testBuffer);
    } catch (error) {
      console.error('Error playing test sound:', error);
    }
  }, [providedAudioContext, localAudioContext, irBuffer]);

  const setupCanvasAndDraw = useCallback(() => {
    if (!waveformCanvas.current || !irBuffer) return;

    const canvas = waveformCanvas.current;
    const context = setupCanvasContext(canvas);
    if (!context) return;

    const color = getAccentColor(canvas);
    drawWaveform(context, irBuffer, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1), color);
  }, [irBuffer]);

  useEffect(() => {
    const audioContext = providedAudioContext || localAudioContext;

    if (!audioContext) return;

    if (irFilePath) {
      loadIR(irFilePath, audioContext);
    }
  }, [irFilePath, providedAudioContext, localAudioContext, loadIR]);

  useEffect(() => {
    if (irBuffer) {
      setupCanvasAndDraw();
    }
  }, [irBuffer, setupCanvasAndDraw]);

  useEffect(() => {
    if (convolverProcessor.current) {
      convolverProcessor.current.setWetDryMix(wetGainValue);
    }
  }, [wetGainValue]);

  useEffect(() => {
    console.log('Component mounted');
    if (!providedAudioContext) {
      console.log('Creating new AudioContext');
      const newAudioContext = new AudioContext();
      setLocalAudioContext(newAudioContext);
    }

    return () => {
      console.log('Component unmounting');
      if (localAudioContext) {
        console.log('Closing local AudioContext');
        localAudioContext.close();
      }
    };
  }, [providedAudioContext]);

  useEffect(() => {
    const audioContext = providedAudioContext || localAudioContext;
    console.log('irBuffer or audioContext changed', irBuffer, audioContext);

    if (irBuffer && audioContext) {
      console.log('Creating new ConvolverProcessor');
      convolverProcessor.current = new ConvolverProcessor({
        audioContext,
        irBuffer,
        wetGainValue,
      });
    }

    return () => {
      if (convolverProcessor.current) {
        console.log('Disposing ConvolverProcessor');
        convolverProcessor.current.dispose();
      }
    };
  }, [providedAudioContext, localAudioContext, irBuffer, wetGainValue]);

  return (
    <div className="convolver-player">
      <div className="convolver-examples">
        {testSounds.map((sound) => (
          <button
            key={sound.label}
            disabled={!irBuffer}
            onClick={() => playTestSound(sound)}
          >
            <i className="lni lni-play"></i>
            {sound.label}
          </button>
        ))}
      </div>
      <div className="convolver-ir">
        {irBuffer ? (
          <span className="convolver-ir-info">
            Duration: {irBuffer.duration.toFixed(2)}s, Sample Rate:{' '}
            {irBuffer.sampleRate}Hz, Channels: {irBuffer.numberOfChannels}
          </span>
        ) : (
          <span>Loading IR...</span>
        )}
        <canvas ref={waveformCanvas} className="convolver-waveform-canvas"></canvas>
        <div className="convolver-controls">
          <label htmlFor="wet-gain">Effect:</label>
          <input
            id="wet-gain"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={wetGainValue}
            onChange={(e) => setWetGainValue(parseFloat(e.target.value))}
            style={{ '--value': `${Math.round(wetGainValue * 100)}%` } as React.CSSProperties}
          />
          <span>{displayedWetGain}</span>
        </div>
      </div>
    </div>
  );
};

export default ConvolverPlayer;
