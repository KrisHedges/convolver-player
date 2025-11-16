<script setup lang="ts">
import { onMounted, ref, type ComponentPublicInstance } from 'vue';
import ConvolverPlayer from './components/ConvolverPlayer.vue';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css'; // You can choose a different theme

const codeBlocks = ref<HTMLElement[]>([]);
const setCodeBlockRef = (el: Element | ComponentPublicInstance | null) => {
  if (el && el instanceof HTMLElement) {
    codeBlocks.value.push(el);
  }
};

onMounted(() => {
  codeBlocks.value.forEach((block) => {
    hljs.highlightElement(block);
  });
});
</script>

<template>
  <div class="container">
    <ConvolverPlayer irFilePath="/ir.wav" />

    <section class="blog-post">
      <h1>Styling the ConvolverPlayer Component</h1>
      <p>The <code>ConvolverPlayer</code> component is designed to be unstyled by default, giving you complete control over its appearance. This allows for maximum flexibility when integrating it into your application's design system.</p>

      <h2>Component Structure</h2>
      <p>The component exposes a clear class structure that you can target with your CSS. Here's a breakdown of the main elements:</p>
      <pre><code :ref="setCodeBlockRef" class="language-html">
&lt;div class="convolver-player"&gt;
  &lt;div class="examples"&gt;
    &lt;button&gt;...&lt;/button&gt;
  &lt;/div&gt;
  &lt;div class="ir"&gt;
    &lt;span class="info"&gt;...&lt;/span&gt;
    &lt;div class="waveform-section"&gt;
      &lt;canvas class="waveform-canvas"&gt;&lt;/canvas&gt;
    &lt;/div&gt;
    &lt;div class="controls"&gt;
      &lt;label&gt;...&lt;/label&gt;
      &lt;input type="range"&gt;
      &lt;span&gt;...&lt;/span&gt;
    &lt;/div&gt;
  &lt;/div&gt;
&lt;/div&gt;
      </code></pre>

      <h2>Styling Example</h2>
      <p>Below is the CSS used in this demo application to style the <code>ConvolverPlayer</code> component. You can adapt these styles or create your own to match your application's theme.</p>
      <pre><code :ref="setCodeBlockRef" class="language-css">
.convolver-player {
  display: grid;
  grid-template-columns: 2fr 5fr;
  column-gap: 1em;
  row-gap: 0;
  padding: 3em;
  margin: 1em 0;
  background-color: rgba(0,0,0,0.1);
  border-radius: 5px;
  height: fit-content;
  box-shadow: 0 0 0.95px ButtonBorder; /* Using system color for shadow */
}

.convolver-player .examples {
  display: grid;
  gap: 1em;
  grid-template-columns: 1fr 1fr;
  align-items: center;
}

.convolver-player .examples button {
  height: 100%;
}

.convolver-player .ir {
  display: grid;
  align-items: center;
  row-gap: .5em;
}

.convolver-player .ir .info {
  align-content: center;
  height: 32px;
}

.convolver-player .ir .waveform-section .waveform-canvas {
  width: 100%;
  height: 100px;
  background-color: Canvas; /* Using system color for background */
  box-shadow: 0 0 0.95px ButtonBorder; /* Using system color for shadow */
}

.convolver-player .ir .controls {
  display: grid;
  grid-template-columns: auto 1fr auto;
}

/* You can further style elements like labels, input[type="range"], and spans within .controls */
      </code></pre>

      <h2>Waveform Colors</h2>
      <p>The waveform itself will attempt to use the browser's <code>accent-color</code> for its primary color. If <code>accent-color</code> is not available, it will fall back to a default blue (<code>#007aff</code>). The background of the waveform canvas will use the system's <code>Canvas</code> color, and its shadow will use <code>ButtonBorder</code>.</p>
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

.container {
  width: 800px;
  margin: 0 auto;
}

.convolver-player {
  display: grid;
  grid-template-columns: 2fr 5fr;
  column-gap: 1em;
  row-gap: 0;
  padding: 3em;
  margin: 1em 0;
  background-color: rgba(0,0,0,0.1);
  border-radius: 5px;
  height: fit-content;
  box-shadow: 0 0 0.95px ButtonBorder;
  .examples {
    display: grid;
    gap: 1em;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    button {
      height: 100%;
    }
  }
  .ir {
    display: grid;
    align-items: center;
    row-gap: .5em;
    .info {
      align-content: center;
      height: 32px;
    }
    .waveform-canvas {
      width: 100%;
      height: 100px;
      background-color: Canvas;
      box-shadow: 0 0 0.95px ButtonBorder;
    }
    .controls {
      display: grid;
      grid-template-columns: auto 1fr auto;
    }
  }
}
</style>
