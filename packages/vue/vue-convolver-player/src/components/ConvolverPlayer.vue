<template>
  <div class="convolver-player">
    <div class="examples">
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
    <div class="ir">
      <h6 v-if="irBuffer" class="info">
        Duration: {{ irBuffer.duration.toFixed(2) }}s, Sample Rate:
        {{ irBuffer.sampleRate }}Hz, Channels: {{ irBuffer.numberOfChannels }}
      </h6>
      <div class="waveform-section">
        <canvas ref="waveformCanvas" class="waveform-canvas"></canvas>
      </div>
      <div class="playback-controls">
        <div class="param-group">
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
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, computed } from "vue";

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

const localAudioContext = ref<AudioContext | null>(null);
const currentAudioContext = computed<AudioContext | null>(
  () => props.audioContext || localAudioContext.value
);

const convolverNode = ref<ConvolverNode | null>(null);
const irBuffer = ref<AudioBuffer | null>(null);
const irFileName = ref<string>("");
const waveformCanvas = ref<HTMLCanvasElement | null>(null);
let ctx: CanvasRenderingContext2D | null = null;
let rafId: number | null = null;
let timeoutId = ref<number | null>(null); // Ref to store setTimeout ID

// Refs to store active audio nodes for proper cleanup
let activeBufferSource = ref<AudioBufferSourceNode | null>(null);
let activeWetGain = ref<GainNode | null>(null);
let activeDryGain = ref<GainNode | null>(null);

const accentColor = ref<string>("");

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
const loadIR = async (path: string) => {
  if (!currentAudioContext.value) {
    console.error("No AudioContext available to load IR.");
    return;
  }

  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    try {
      irBuffer.value = await currentAudioContext.value.decodeAudioData(
        arrayBuffer
      );
      irFileName.value = path.split("/").pop() || ""; // Extract file name
      setupCanvas();
    } catch (decodeError) {
      console.error("Error decoding IR audio data:", decodeError);
    }
  } catch (error) {
    console.error("Error loading IR:", error);
    irBuffer.value = null;
    irFileName.value = "";
  }
};

// Function to generate and play a test sound through the IR
const playTestSound = async (soundConfig: TestSound) => {
  if (!currentAudioContext.value) {
    const AudioContext =
      window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContext) {
      localAudioContext.value = new AudioContext();
    } else {
      console.error("AudioContext is not supported in this browser.");
      return;
    }
  }

  if (
    currentAudioContext.value &&
    currentAudioContext.value.state === "suspended"
  ) {
    await currentAudioContext.value.resume();
  }

  if (!currentAudioContext.value || !irBuffer.value) {
    console.warn("AudioContext or IR not ready.");
    return;
  }

  if (timeoutId.value) {
    clearTimeout(timeoutId.value);
  }

  if (activeBufferSource.value) {
    try {
      activeBufferSource.value.stop();
      activeBufferSource.value.disconnect();
    } catch (e) {
      console.warn("Could not stop/disconnect previous buffer source:", e);
    }
  }
  if (activeWetGain.value) {
    activeWetGain.value.disconnect();
  }
  if (activeDryGain.value) {
    activeDryGain.value.disconnect();
  }

  const bufferSource = currentAudioContext.value.createBufferSource();
  let testBuffer: AudioBuffer;
  let duration: number;

  if (soundConfig.type === "sample") {
    try {
      const response = await fetch(soundConfig.path);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      try {
        testBuffer = await currentAudioContext.value.decodeAudioData(
          arrayBuffer
        );
        duration = testBuffer.duration;
      } catch (decodeError) {
        console.error("Error decoding sample audio data:", decodeError);
        return;
      }
    } catch (error) {
      console.error("Error loading sample:", error);
      return;
    }
  }

  bufferSource.buffer = testBuffer!;
  activeBufferSource.value = bufferSource;

  if (!convolverNode.value) {
    convolverNode.value = currentAudioContext.value.createConvolver();
  }
  convolverNode.value.buffer = irBuffer.value;

  const wetGain = currentAudioContext.value.createGain();
  wetGain.gain.value = wetGainValue.value;
  activeWetGain.value = wetGain;

  const dryGain = currentAudioContext.value.createGain();
  dryGain.gain.value = 1 - wetGainValue.value;
  activeDryGain.value = dryGain;

  bufferSource.connect(dryGain);
  dryGain.connect(currentAudioContext.value.destination);

  bufferSource.connect(convolverNode.value);
  convolverNode.value.connect(wetGain);
  wetGain.connect(currentAudioContext.value.destination);

  bufferSource.start(0);

  bufferSource.onended = () => {
    bufferSource.disconnect();
  };

  const totalDuration = duration! + irBuffer.value.duration;
  timeoutId.value = setTimeout(() => {
    convolverNode.value?.disconnect();
    wetGain.disconnect();
    dryGain.disconnect();
    activeBufferSource.value = null;
    activeWetGain.value = null;
    activeDryGain.value = null;
    timeoutId.value = null;
  }, totalDuration * 1000);
};

const setupCanvas = () => {
  if (!waveformCanvas.value) return;

  const canvas = waveformCanvas.value;
  const rect = canvas.getBoundingClientRect();
  const logicalWidth = rect.width;
  const logicalHeight = rect.height;

  ctx = canvas.getContext("2d");
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  canvas.width = logicalWidth * dpr;
  canvas.height = logicalHeight * dpr;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const computedStyle = getComputedStyle(canvas);
  const computedAccentColor = computedStyle
    .getPropertyValue("accent-color")
    .trim();
  accentColor.value = computedAccentColor || "#007aff"; // Fallback to a default blue

  ctx.clearRect(0, 0, logicalWidth, logicalHeight);
  drawWaveform(logicalWidth, logicalHeight);
};

const drawWaveform = (width: number, height: number) => {
  if (!ctx || !irBuffer.value) return;

  const data = irBuffer.value.getChannelData(0);
  const step = Math.ceil(data.length / width);

  let maxAmplitude = 0;
  for (let i = 0; i < data.length; i++) {
    const datum = data[i];
    if (datum !== undefined) {
      const absDatum = Math.abs(datum);
      if (absDatum > maxAmplitude) {
        maxAmplitude = absDatum;
      }
    }
  }

  if (maxAmplitude === 0) maxAmplitude = 0.01;

  const verticalCenter = height / 2;

  ctx.beginPath();

  ctx.strokeStyle = accentColor.value;
  ctx.lineWidth = 1.5;

  for (let i = 0; i < width; i++) {
    let min = 0;
    let max = 0;
    const startIndex = i * step;
    const endIndex = Math.min(startIndex + step, data.length);

    if (startIndex < endIndex) {
      const firstDatum = data[startIndex];
      if (firstDatum !== undefined) {
        min = firstDatum;
        max = firstDatum;
      }
      for (let j = startIndex + 1; j < endIndex; j++) {
        const datum = data[j];
        if (datum !== undefined) {
          if (datum < min) min = datum;
          if (datum > max) max = datum;
        }
      }
    }

    const normalizedMin = min / maxAmplitude;
    const normalizedMax = max / maxAmplitude;

    ctx.lineTo(i, verticalCenter + normalizedMin * verticalCenter);
    ctx.lineTo(i, verticalCenter + normalizedMax * verticalCenter);
  }
  ctx.stroke();
};

watch(
  [() => props.irFilePath, currentAudioContext],
  ([newPath, newAudioContext]) => {
    if (newPath && newAudioContext) {
      loadIR(newPath as string);
    } else if (!newPath) {
      irBuffer.value = null;
      irFileName.value = "";
      if (ctx && waveformCanvas.value) {
        ctx.clearRect(
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
  if (activeWetGain.value) {
    activeWetGain.value.gain.value = newValue;
  }
  if (activeDryGain.value) {
    activeDryGain.value.gain.value = 1 - newValue;
  }
});

watch(irBuffer, () => {
  if (rafId) {
    window.cancelAnimationFrame(rafId);
  }
  rafId = window.requestAnimationFrame(setupCanvas);
});

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  if (!props.audioContext) {
    const AudioContext =
      window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContext) {
      localAudioContext.value = new AudioContext();
    } else {
      console.error("AudioContext is not supported in this browser.");
    }
  }

  if (
    currentAudioContext.value &&
    currentAudioContext.value.state === "suspended"
  ) {
    currentAudioContext.value.resume();
  }

  resizeObserver = new ResizeObserver(() => {
    if (rafId) {
      window.cancelAnimationFrame(rafId);
    }
    rafId = window.requestAnimationFrame(setupCanvas);
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
  if (localAudioContext.value && localAudioContext.value.state !== "closed") {
    localAudioContext.value.close();
  }
});
</script>
