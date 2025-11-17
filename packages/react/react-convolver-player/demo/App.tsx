import React, { useState, useEffect, useRef } from 'react';
import { ConvolverPlayer } from '../src';
import './index.css';
import irFile from './ir.wav';

function App() {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Create and manage a single AudioContext for the demo
    if (!audioContextRef.current) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = ctx;
      setAudioContext(ctx);
    }

    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  return (
    <div className="container">
      <h1>Convolver Player Demo (React)</h1>
      {audioContext ? (
        <ConvolverPlayer irFilePath={irFile} audioContext={audioContext} />
      ) : (
        <p>Loading AudioContext...</p>
      )}
    </div>
  );
}

export default App;
