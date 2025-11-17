import { useState, useEffect, useRef, useCallback } from 'react';
import ConvolverPlayer from './components/ConvolverPlayer';
import './index.css';
import irFile from '../demo/ir.wav'; // Keep irFile in demo for now

import clickSound from './assets/sounds/click.wav';
import guitarSound from './assets/sounds/guitar.wav';
import pianoSound from './assets/sounds/piano.wav';
import snareSound from './assets/sounds/snare.wav';

import hljs from 'highlight.js';
import 'highlight.js/styles/github.css'; // Or any other theme you prefer

const testSounds = [
  { label: 'Click', path: clickSound },
  { label: 'Guitar', path: guitarSound },
  { label: 'Piano', path: pianoSound },
  { label: 'Snare', path: snareSound },
];

function App() {
  const [sharedAudioContext, setSharedAudioContext] = useState<AudioContext | null>(null);
  const codeBlocksRef = useRef<HTMLElement[]>([]);

  const setCodeBlockRef = useCallback((el: HTMLElement | null) => {
    if (el && !codeBlocksRef.current.includes(el)) {
      codeBlocksRef.current.push(el);
    }
  }, []);

  useEffect(() => {
    // Initialize shared AudioContext
    const context = new (window.AudioContext || window.webkitAudioContext)();
    setSharedAudioContext(context);

    return () => {
      if (context && context.state !== 'closed') {
        context.close();
      }
    };
  }, []);

  useEffect(() => {
    // Highlight code blocks after rendering
    codeBlocksRef.current.forEach((block) => {
      hljs.highlightElement(block);
    });
  }, [sharedAudioContext]); // Re-highlight if sharedAudioContext changes (though it shouldn't after initial load)


  const singleUseCode = `
import React from 'react';
import { ConvolverPlayer } from '@convolver-player/react';
import irFile from './ir.wav'; // Your impulse response file

function MyComponent() {
  return (
    <ConvolverPlayer irFilePath={irFile} />
  );
}
`;

  const multiUseCode = `
import React, { useState, useEffect, useRef } from 'react';
import { ConvolverPlayer } from '@convolver-player/react';
import irFile from './ir.wav'; // Your impulse response file
import clickSound from './assets/sounds/click.wav'; // Example test sound

const testSounds = [
  { label: 'Click', path: clickSound },
  // ... other sounds
];

function MyMultiPlayerComponent() {
  const [sharedAudioContext, setSharedAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    setSharedAudioContext(context);

    if (context.state === 'suspended') {
      context.resume();
    }

    return () => {
      if (context && context.state !== 'closed') {
        context.close();
      }
    };
  }, []);

  return (
    <>
      {sharedAudioContext ? (
        <>
          <ConvolverPlayer irFilePath={irFile} audioContext={sharedAudioContext} />
          {testSounds.map((sound, index) => (
            <ConvolverPlayer key={index} irFilePath={sound.path} audioContext={sharedAudioContext} />
          ))}
        </>
      ) : (
        <p>Loading AudioContext...</p>
      )}
    </>
  );
}
`;


  return (
    <div className="container">
      <h1>Convolver Player Demo (React)</h1>

      <section>
        <h2>Single Use Example</h2>
        <p>
          Here's the simplest use case: a single instance of the{' '}
          <code>ConvolverPlayer</code> component. Just point it to your wav file
          to use, and it will handle the AudioContext creation for you.
        </p>
        <ConvolverPlayer irFilePath={irFile} />
        <pre>
          <code ref={setCodeBlockRef} className="language-jsx">
            {singleUseCode}
          </code>
        </pre>
      </section>

      <section>
        <h2>Multi-Use Example (Shared AudioContext)</h2>
        <p>
          When using multiple <code>ConvolverPlayer</code> components on the same
          page, it's best practice to share a single{' '}
          <code>AudioContext</code> instance. This prevents resource exhaustion
          and potential performance issues that can arise from creating multiple
          contexts. The <code>ConvolverPlayer</code> component accepts an{' '}
          <code>audioContext</code> prop for this purpose.
        </p>
        {sharedAudioContext ? (
          <>
            <ConvolverPlayer irFilePath={irFile} audioContext={sharedAudioContext} />
            {testSounds.map((sound, index) => (
              <ConvolverPlayer key={index} irFilePath={sound.path} audioContext={sharedAudioContext} />
            ))}
          </>
        ) : (
          <p>Loading AudioContext...</p>
        )}
        <pre>
          <code ref={setCodeBlockRef} className="language-jsx">
            {multiUseCode}
          </code>
        </pre>
      </section>

      <section>
        <h2>Component Structure</h2>
        <p>
          The component's class structure can be targeted with your CSS. Here's
          a breakdown of the main elements:
        </p>
        <pre>
          <code ref={setCodeBlockRef} className="language-html">
            {`
<div class="convolver-player">
  <div class="convolver-examples">
    <button>...</button>
  </div>
  <div class="convolver-ir">
    <span class="convolver-ir-info">...</span>
    <canvas class="convolver-waveform-canvas"></canvas>
    <div class="convolver-controls">
      <label>...</label>
      <input type="range">
      <span>...</span>
    </div>
  </div>
</div>
            `}
          </code>
        </pre>
      </section>

      <section>
        <h2>Styling Example</h2>
        <p>
          Below is the CSS used in this demo application to style the{' '}
          <code>ConvolverPlayer</code> component. You can adapt these styles or
          create your own to match your application's theme.
        </p>
        <p>
          The waveform itself will attempt to use the browser's{' '}
          <code>accent-color</code> for its primary color. If{' '}
          <code>accent-color</code> is not available, it will fall back to a
          default blue (<code>#007aff</code>).
        </p>
        <pre>
          <code ref={setCodeBlockRef} className="language-css">
            {`
/* Demo style for ConvolverPlayer */
:root {
  accent-color: rgb(139, 82, 199);
}
.convolver-player {
  display: grid;
  grid-template-columns: 2fr 5fr;
  column-gap: 1em;
  padding: 2em;
  margin: 1em 0;
  background-color: rgba(0,0,0,0.1);
  box-shadow: 0 0 0.95px ButtonBorder;
  .convolver-examples {
    display: grid;
    gap: 0.35em;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    button {
      height: 100%;
    }
  }
  .convolver-ir {
    display: grid;
    align-items: center;
    gap: .5em;
    .convolver-ir-info {
      align-content: center;
    }
    .convolver-waveform-canvas {
      width: 100%;
      height: 100px;
      background-color: Canvas;
      box-shadow: 0 0 0.95px ButtonBorder;
    }
    .convolver-controls {
      display: grid;
      grid-template-columns: auto 1fr auto;
    }
  }
}
            `}
          </code>
        </pre>
      </section>
    </div>
  );
}

export default App;
