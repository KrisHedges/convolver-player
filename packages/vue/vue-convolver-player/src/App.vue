<script setup lang="ts">
import {
  onMounted,
  ref,
  onBeforeUnmount,
  nextTick,
} from "vue";
import ConvolverPlayer from "./components/ConvolverPlayer.vue";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

const sharedAudioContext = ref<AudioContext | null>(null); // Declare sharedAudioContext here

const codeBlocks = ref<HTMLElement[]>([]);
const setCodeBlockRef = (el: Element | null) => {
  if (el && el instanceof HTMLElement) {
    codeBlocks.value.push(el);
  }
};

onMounted(() => {
  nextTick(() => {
    codeBlocks.value.forEach((block) => {
      hljs.highlightElement(block);
    });
  });
});

onMounted(async () => {
  // Create a new AudioContext for shared use
  const context = new AudioContext();
  sharedAudioContext.value = context;

  // Resume audio context if it's suspended (e.g., due to browser autoplay policies)
  if (context.state === 'suspended') {
    await context.resume();
  }
});

onBeforeUnmount(() => {
  if (sharedAudioContext.value) {
    sharedAudioContext.value.close();
  }
});
</script>

<template>
  <div class="container">
    <h1>ConvolverPlayer Demo</h1>

    <section>
      <h2>Single Use Example</h2>
      <p>
        Here's the simplest use case a single instance of the <code>ConvolverPlayer</code> component. Just point it to your wav file to use and it will handle the AudioContext creation for you.
      </p>
      <ConvolverPlayer ir-file-path="/ir.wav" />
      <pre><code :ref="setCodeBlockRef" class="language-html">
&lt;script&gt;
  /** The easiest use case just give it the file path */
  import ConvolverPlayer from './components/ConvolverPlayer.vue';
&lt;/script&gt;

&lt;template&gt;
  &lt;ConvolverPlayer irFilePath="/ir.wav" /&gt;
&lt;/template&gt;
      </code></pre>
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
      <template v-if="sharedAudioContext">
        <ConvolverPlayer ir-file-path="/ir.wav" :audio-context="sharedAudioContext" />
        <ConvolverPlayer
          ir-file-path="/src/assets/sounds/click.wav"
          :audio-context="sharedAudioContext"
        />
        <ConvolverPlayer
          ir-file-path="/src/assets/sounds/piano.wav"
          :audio-context="sharedAudioContext"
        />
        <ConvolverPlayer
          ir-file-path="/src/assets/sounds/guitar.wav"
          :audio-context="sharedAudioContext"
        />
      </template>
      <pre><code :ref="setCodeBlockRef" class="language-html">
&lt;script setup lang="ts"&gt;
import { ref, onMounted, onBeforeUnmount } from 'vue';
import ConvolverPlayer from './components/ConvolverPlayer.vue';

/** Setup a shared AudioContext to use for all players */
const sharedAudioContext = ref&lt;AudioContext | null&gt;(null);

onMounted(async () => {
  const context = new AudioContext();
  sharedAudioContext.value = context;
  if (context.state === 'suspended') {
    await context.resume();
  }
});

/** Cleanup AudioContext when unmounted */
onBeforeUnmount(() => {
  if (sharedAudioContext.value) {
    sharedAudioContext.value.close();
  }
});
&lt;/script&gt;

&lt;template&gt;
  &lt;ConvolverPlayer irFilePath="/ir.wav" :audioContext="sharedAudioContext" /&gt;
  &lt;ConvolverPlayer irFilePath="/src/assets/sounds/click.wav" :audioContext="sharedAudioContext" /&gt;
  &lt;ConvolverPlayer irFilePath="/src/assets/sounds/piano.wav" :audioContext="sharedAudioContext" /&gt;
  &lt;ConvolverPlayer irFilePath="/src/assets/sounds/guitar.wav" :audioContext="sharedAudioContext" /&gt;
&lt;/template&gt;
      </code></pre>
    </section>

    <section>
      <h2>Component Structure</h2>
      <p>
        The components class structure can be targeted with
        your CSS. Here's a breakdown of the main elements:
      </p>
      <pre><code :ref="setCodeBlockRef" class="language-html">
&lt;div class="convolver-player"&gt;
  &lt;div class="convolver-examples"&gt;
    &lt;button&gt;...&lt;/button&gt;
  &lt;/div&gt;
  &lt;div class="convolver-ir"&gt;
    &lt;canvas class="convolver-waveform-canvas"&gt;&lt;/canvas&gt;
    &lt;div class="convolver-controls"&gt;
      &lt;label&gt;...&lt;/label&gt;
      &lt;input type="range"&gt;
      &lt;span&gt;...&lt;/span&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/div&gt;
      </code></pre>
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
      <pre><code :ref="setCodeBlockRef" class="language-css">
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
</code></pre>
    </section>
  </div>
</template>

<style>
:root {
  font-family: system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  color-scheme: light dark;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  accent-color: rgb(139, 82, 199);
}

body {
  font-size: 16px;
}
pre {
  box-shadow: 0 0 0.95px ButtonBorder;
}
.container {
  width: 800px;
  margin: 0 auto;
}

/* Existing convolver-player styles */
.convolver-player {
  display: grid;
  grid-template-columns: 2fr 5fr;
  column-gap: 1em;
  padding: 2em;
  margin: 1em 0;
  background-color: rgba(0, 0, 0, 0.1);
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
    gap: 0.5em;
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
</style>
