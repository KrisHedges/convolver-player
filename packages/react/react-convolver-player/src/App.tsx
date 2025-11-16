import React, { useState, useEffect, useRef } from "react";
import ConvolverPlayer from "./components/ConvolverPlayer";
import "./App.css";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

import click from "./assets/sounds/click.wav";
import piano from "./assets/sounds/piano.wav";
import guitar from "./assets/sounds/guitar.wav";
import snare from "./assets/sounds/snare.wav";
import ir from "../demo/ir.wav";

const testSounds = [
  { label: "Click", type: "sample", path: click },
  { label: "Piano", type: "sample", path: piano },
  { label: "Guitar", type: "sample", path: guitar },
  { label: "Snare", type: "sample", path: snare },
];

function App() {
  const [sharedAudioContext, setSharedAudioContext] =
    useState<AudioContext | null>(null);
  const codeBlocks = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const context = new AudioContext();
    setSharedAudioContext(context);

    return () => {
      if (sharedAudioContext) {
        sharedAudioContext.close();
      }
    };
  }, []);

  useEffect(() => {
    codeBlocks.current.forEach((block) => {
      hljs.highlightElement(block);
    });
  }, [codeBlocks]);

  const setCodeBlockRef = (el: HTMLElement | null) => {
    if (el && !codeBlocks.current.includes(el)) {
      codeBlocks.current.push(el);
    }
  };

  return (
    <div className="container">
      <h1>ConvolverPlayer Demo (React)</h1>

      <section>
        <h2>Single Use Example</h2>
        <p>
          Here's the simplest use case a single instance of the{" "}
          <code>ConvolverPlayer</code> component. Just point it to your wav file
          to use and it will handle the AudioContext creation for you.
        </p>
        <ConvolverPlayer irFilePath={ir} testSounds={testSounds} />
        <pre>
          <code ref={setCodeBlockRef} className="language-tsx">
            {`
import React from 'react';
import ConvolverPlayer from './components/ConvolverPlayer';

function MyComponent() {
  return (
    <ConvolverPlayer irFilePath="/demo/ir.wav" />
  );
}
`}
          </code>
        </pre>
      </section>

      <section>
        <h2>Multi-Use Example (Shared AudioContext)</h2>
        <p>
          When using multiple <code>ConvolverPlayer</code> components on the
          same page, it's best practice to share a single
          <code>AudioContext</code> instance. This prevents resource exhaustion
          and potential performance issues that can arise from creating multiple
          contexts. The <code>ConvolverPlayer</code> component accepts an
          <code>audioContext</code> prop for this purpose.
        </p>
        {sharedAudioContext && (
          <>
            <ConvolverPlayer
              irFilePath={ir}
              audioContext={sharedAudioContext}
              testSounds={testSounds}
            />
            <ConvolverPlayer
              irFilePath={click}
              audioContext={sharedAudioContext}
              testSounds={testSounds}
            />
            <ConvolverPlayer
              irFilePath={piano}
              audioContext={sharedAudioContext}
              testSounds={testSounds}
            />
            <ConvolverPlayer
              irFilePath={guitar}
              audioContext={sharedAudioContext}
              testSounds={testSounds}
            />
          </>
        )}
        <pre>
          <code ref={setCodeBlockRef} className="language-tsx">
            {`
import React, { useState, useEffect } from 'react';
import ConvolverPlayer from './components/ConvolverPlayer';

function MyComponentWithSharedContext() {
  const [sharedAudioContext, setSharedAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    const context = new AudioContext();
    setSharedAudioContext(context);
    return () => {
      if (context) {
        context.close();
      }
    };
  }, []);

  return (
    <>
      {sharedAudioContext && (
        <>
          <ConvolverPlayer irFilePath="/demo/ir.wav" audioContext={sharedAudioContext} />
          <ConvolverPlayer irFilePath="/src/assets/sounds/click.wav" audioContext={sharedAudioContext} />
          <ConvolverPlayer irFilePath="/src/assets/sounds/piano.wav" audioContext={sharedAudioContext} />
          <ConvolverPlayer irFilePath="/src/assets/sounds/guitar.wav" audioContext={sharedAudioContext} />
        </>
      )}
    </>
  );
}
`}
          </code>
        </pre>
      </section>

      <section>
        <h2>Component Structure</h2>
        <p>
          The components class structure can be targeted with your CSS. Here's a
          breakdown of the main elements:
        </p>
        <pre>
          <code ref={setCodeBlockRef} className="language-html">
            {`
<div class="convolver-player">
  <div class="convolver-examples">
    <button>...</button>
  </div>
  <div class="convolver-ir">
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
          Below is the CSS used in this demo application to style the
          <code>ConvolverPlayer</code> component. You can adapt these styles or
          create your own to match your application's theme.
        </p>
        <p>
          The waveform itself will attempt to use the browser's
          <code>accent-color</code> for its primary color. If
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
