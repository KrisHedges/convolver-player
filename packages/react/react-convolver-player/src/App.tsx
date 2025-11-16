import React, { useState, useEffect } from 'react';
import ConvolverPlayer from './components/ConvolverPlayer';
import './App.css';

import click from './assets/sounds/click.wav';
import piano from './assets/sounds/piano.wav';
import guitar from './assets/sounds/guitar.wav';
import snare from './assets/sounds/snare.wav';
import ir from '../demo/ir.wav';

const testSounds = [
  { label: 'Click', type: 'sample', path: click },
  { label: 'Piano', type: 'sample', path: piano },
  { label: 'Guitar', type: 'sample', path: guitar },
  { label: 'Snare', type: 'sample', path: snare },
];

function App() {
  const [sharedAudioContext, setSharedAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    const context = new AudioContext();
    setSharedAudioContext(context);

    return () => {
      if (sharedAudioContext) {
        sharedAudioContext.close();
      }
    };
  }, []);

  return (
    <div className="container">
      <h1>ConvolverPlayer Demo (React)</h1>

      <section>
        <h2>Single Use Example</h2>
        <p>
          Here's the simplest use case a single instance of the <code>ConvolverPlayer</code> component. Just point it to your wav file to use and it will handle the AudioContext creation for you.
        </p>
        <ConvolverPlayer irFilePath={ir} testSounds={testSounds} />
      </section>

      <section>
        <h2>Multi-Use Example (Shared AudioContext)</h2>
        <p>
          When using multiple <code>ConvolverPlayer</code> components on the same
          page, it's best practice to share a single
          <code>AudioContext</code> instance. This prevents resource exhaustion
          and potential performance issues that can arise from creating multiple
          contexts. The <code>ConvolverPlayer</code> component accepts an
          <code>audioContext</code> prop for this purpose.
        </p>
        {sharedAudioContext && (
          <>
            <ConvolverPlayer irFilePath={ir} audioContext={sharedAudioContext} testSounds={testSounds} />
            <ConvolverPlayer irFilePath={click} audioContext={sharedAudioContext} testSounds={testSounds} />
            <ConvolverPlayer irFilePath={piano} audioContext={sharedAudioContext} testSounds={testSounds} />
            <ConvolverPlayer irFilePath={guitar} audioContext={sharedAudioContext} testSounds={testSounds} />
          </>
        )}
      </section>
    </div>
  );
}

export default App;
