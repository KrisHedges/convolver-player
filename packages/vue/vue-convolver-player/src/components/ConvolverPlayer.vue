<template>
  <div class="convolver-player">
    <div class="convolver-examples">
      <button
        v-for="sound in testSounds"
        :key="sound.label"
        @click="playTestSound(sound)"
        :disabled="!irBuffer"
      >
        <i class="lni lni-play"></i>
        {{ sound.label }}
      </button>
    </div>
    <div class="convolver-ir">

      <canvas ref="waveformCanvas" class="convolver-waveform-canvas"></canvas>
      <div class="convolver-controls">
        <label for="wet-gain">Effect:</label>
        <input
          type="range"
          id="wet-gain"
          min="0"
          max="1"
          step="0.01"
          v-model="wetGainValue"
          :style="`--value: ${Math.round(wetGainValue * 100)}%`"
        />
        <span key="wet-gain-display-key">{{ displayedWetGain }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed } from "vue";
import { // CORRECTED IMPORT
  AudioContextManager,
  loadAudioBuffer,
  ConvolverProcessor,
  drawWaveform,
  setupCanvasContext,
  getAccentColor,
} from "@convolver-player/core";

interface TestSound {
  label: string;
  type: "sample";
  path: string;
}

interface Props {
  irFilePath: string;
  audioContext?: AudioContext | null;
}

const props = defineProps<Props>();

let audioContextManager: AudioContextManager | null = null;
let convolverProcessor: ConvolverProcessor | null = null;

const irBuffer = ref<AudioBuffer | null>(null);
const waveformCanvas = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);
let rafId: number | null = null;

const wetGainValue = ref<number>(1); // Initial wet gain value (100% wet)

const displayedWetGain = computed<string>(() => {
  return String((wetGainValue.value * 100).toFixed(0)) + "%";
});

import click from "../assets/sounds/click.wav";
import piano from "../assets/sounds/piano.wav";
import guitar from "../assets/sounds/guitar.wav";
import snare from "../assets/sounds/snare.wav";

const testSounds: TestSound[] = [
  { label: "Click", type: "sample", path: click },
  { label: "Piano", type: "sample", path: piano },
  { label: "Guitar", type: "sample", path: guitar },
  { label: "Snare", type: "sample", path: snare },
];

// Function to load the IR
const loadIR = async (path: string, audioContext: AudioContext) => {
  try {
    irBuffer.value = await loadAudioBuffer(audioContext, path);
    setupCanvasAndDraw();
  } catch (error) {
    console.error("Error loading IR:", error);
    irBuffer.value = null;
  }
};

// Function to generate and play a test sound through the IR
const playTestSound = async (soundConfig: TestSound) => {
  if (!audioContextManager || !convolverProcessor) {
    console.warn("AudioContextManager or ConvolverProcessor not initialized.");
    return;
  }

  const audioContext = await audioContextManager.getAudioContext();
  if (!audioContext) {
    console.error("No AudioContext available.");
    return;
  }
  await audioContextManager.resumeAudioContext();

  if (!irBuffer.value) {
    console.warn("IR not ready.");
    return;
  }

  try {
    const testBuffer = await loadAudioBuffer(audioContext, soundConfig.path);
    await convolverProcessor.play(testBuffer);
  } catch (error) {
    console.error("Error playing test sound:", error);
  }
};

const setupCanvasAndDraw = () => {
  if (!waveformCanvas.value || !irBuffer.value) return;

  const canvas = waveformCanvas.value;
  const context = setupCanvasContext(canvas);
  if (!context) return;
  ctx.value = context;

  const color = getAccentColor(canvas);
  drawWaveform(ctx.value, irBuffer.value, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1), color);
};

watch(
  () => props.irFilePath,
  async (newPath) => {
    if (!audioContextManager) return;
    const audioContext = await audioContextManager.getAudioContext();
    if (!audioContext) return;

    if (newPath) {
      await loadIR(newPath, audioContext);
      if (irBuffer.value && convolverProcessor) {
        convolverProcessor.updateIrBuffer(irBuffer.value);
      } else if (irBuffer.value && !convolverProcessor) {
        // This case should ideally not happen if onMounted initializes it correctly
        // but provides a fallback if irBuffer is set before onMounted completes
        convolverProcessor = new ConvolverProcessor({
          audioContext: audioContext,
          irBuffer: irBuffer.value,
          wetGainValue: wetGainValue.value,
        });
      }
    } else {
      irBuffer.value = null;
      if (ctx.value && waveformCanvas.value) {
        ctx.value.clearRect(
          0,
          0,
          waveformCanvas.value.width,
          waveformCanvas.value.height
        );
      }
    }
  },
  { immediate: true }
);

watch(wetGainValue, (newValue: number) => {
  if (convolverProcessor) {
    convolverProcessor.setWetDryMix(newValue);
  }
});

watch(irBuffer, () => {
  if (rafId) {
    window.cancelAnimationFrame(rafId);
  }
  rafId = window.requestAnimationFrame(setupCanvasAndDraw);
});

let resizeObserver: ResizeObserver | null = null;

onMounted(async () => {
  audioContextManager = new AudioContextManager(props.audioContext);
  const audioContext = await audioContextManager.getAudioContext();
  if (!audioContext) {
    console.error("AudioContext is not supported in this browser.");
    return;
  }
  await audioContextManager.resumeAudioContext();

  // Initialize convolverProcessor here if irFilePath is already set
  if (props.irFilePath && !convolverProcessor) {
    await loadIR(props.irFilePath, audioContext); // Load IR first
    if (irBuffer.value) {
      convolverProcessor = new ConvolverProcessor({
        audioContext: audioContext,
        irBuffer: irBuffer.value,
        wetGainValue: wetGainValue.value,
      });
    }
  }

  resizeObserver = new ResizeObserver(() => {
    if (rafId) {
      window.cancelAnimationFrame(rafId);
    }
    rafId = window.requestAnimationFrame(setupCanvasAndDraw);
  });

  if (waveformCanvas.value && waveformCanvas.value.parentElement) {
    resizeObserver.observe(waveformCanvas.value.parentElement);
  }
});

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
  if (rafId) {
    window.cancelAnimationFrame(rafId);
  }
  if (convolverProcessor) {
    convolverProcessor.dispose();
  }
  if (audioContextManager) {
    audioContextManager.closeLocalAudioContext();
  }
});
</script>