import { ref, watch, onMounted, onBeforeUnmount, computed, withDefaults } from 'vue';
import PlayIcon from './PlayIcon.vue';
import { loadAudioBuffer, ConvolverProcessor, drawWaveform, setupCanvasContext, getAccentColor, } from '@convolver-player/core';
const props = withDefaults(defineProps(), {
    irFilePath: null,
    audioContext: undefined,
});
let convolverProcessor = null;
const localAudioContext = ref(null);
const irBuffer = ref(null);
const waveformCanvas = ref(null);
const ctx = ref(null);
let rafId = null;
const wetGainValue = ref(0.75); // Initial wet gain value (75% wet)
const displayedWetGain = computed(() => {
    return String((wetGainValue.value * 100).toFixed(0)) + '%';
});
import click from '../assets/sounds/click.wav';
import piano from '../assets/sounds/piano.wav';
import guitar from '../assets/sounds/guitar.wav';
import snare from '../assets/sounds/snare.wav';
const testSounds = [
    { label: 'Click', type: 'sample', path: click },
    { label: 'Guitar', type: 'sample', path: guitar },
    { label: 'Piano', type: 'sample', path: piano },
    { label: 'Snare', type: 'sample', path: snare },
];
// Function to load the IR
const loadIR = async (path, audioContext) => {
    try {
        irBuffer.value = await loadAudioBuffer(audioContext, path);
        setupCanvasAndDraw();
    }
    catch (error) {
        console.error('Error loading IR:', error);
        irBuffer.value = null;
    }
};
// Function to generate and play a test sound through the IR
const playTestSound = async (soundConfig) => {
    const audioContext = props.audioContext || localAudioContext.value;
    if (!audioContext || !convolverProcessor) {
        console.warn('AudioContext or ConvolverProcessor not initialized.');
        return;
    }
    // Resume audio context if it's suspended (e.g., due to browser autoplay policies)
    if (audioContext.state === 'suspended') {
        await audioContext.resume();
    }
    if (!irBuffer.value) {
        console.warn('IR not ready.');
        return;
    }
    try {
        const testBuffer = await loadAudioBuffer(audioContext, soundConfig.path);
        await convolverProcessor.play(testBuffer);
    }
    catch (error) {
        console.error('Error playing test sound:', error);
    }
};
const setupCanvasAndDraw = () => {
    if (!waveformCanvas.value || !irBuffer.value)
        return;
    const canvas = waveformCanvas.value;
    const context = setupCanvasContext(canvas);
    if (!context)
        return;
    ctx.value = context;
    const color = getAccentColor(canvas);
    drawWaveform(ctx.value, irBuffer.value, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1), color);
};
watch(() => props.irFilePath, async (newPath) => {
    const audioContext = props.audioContext || localAudioContext.value;
    if (!audioContext)
        return;
    if (newPath) {
        await loadIR(newPath, audioContext);
        if (irBuffer.value) {
            if (convolverProcessor) {
                convolverProcessor.updateIrBuffer(irBuffer.value); // Call updateIrBuffer
            }
            else {
                convolverProcessor = new ConvolverProcessor({
                    // Initialize if not exists
                    audioContext: audioContext,
                    irBuffer: irBuffer.value,
                    wetGainValue: wetGainValue.value, // Pass wetGainValue
                });
            }
        }
    }
    else {
        irBuffer.value = null;
        if (ctx.value && waveformCanvas.value) {
            ctx.value.clearRect(0, 0, waveformCanvas.value.width, waveformCanvas.value.height);
        }
    }
}, { immediate: true });
watch(irBuffer, () => {
    if (rafId) {
        window.cancelAnimationFrame(rafId);
    }
    rafId = window.requestAnimationFrame(setupCanvasAndDraw);
});
watch(wetGainValue, (newValue) => {
    if (convolverProcessor) {
        convolverProcessor.setWetDryMix(newValue);
    }
});
let resizeObserver = null;
onMounted(async () => {
    let audioContext;
    if (props.audioContext) {
        audioContext = props.audioContext;
    }
    else {
        localAudioContext.value = new AudioContext();
        audioContext = localAudioContext.value;
    }
    if (!audioContext) {
        console.error('AudioContext is not supported in this browser.');
        return;
    }
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
    if (localAudioContext.value) {
        // Check if local context exists
        localAudioContext.value.close(); // Close local context
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_defaults = {
    irFilePath: null,
    audioContext: undefined,
};
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "convolver-player" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "convolver-examples" },
});
for (const [sound] of __VLS_getVForSourceType((__VLS_ctx.testSounds))) {
    // @ts-ignore
    [testSounds,];
    __VLS_asFunctionalElement(__VLS_intrinsics.button, __VLS_intrinsics.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.playTestSound(sound);
                // @ts-ignore
                [playTestSound,];
            } },
        key: (sound.label),
        disabled: (!__VLS_ctx.irBuffer),
        ...{ style: {} },
    });
    // @ts-ignore
    [irBuffer,];
    /** @type {[typeof PlayIcon, ]} */ ;
    // @ts-ignore
    const __VLS_0 = __VLS_asFunctionalComponent(PlayIcon, new PlayIcon({}));
    const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
    (sound.label);
}
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "convolver-ir" },
});
if (__VLS_ctx.irBuffer) {
    // @ts-ignore
    [irBuffer,];
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
        ...{ class: "convolver-ir-info" },
    });
    (__VLS_ctx.irBuffer.duration.toFixed(2));
    (__VLS_ctx.irBuffer.sampleRate);
    (__VLS_ctx.irBuffer.numberOfChannels);
    // @ts-ignore
    [irBuffer, irBuffer, irBuffer,];
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({});
}
__VLS_asFunctionalElement(__VLS_intrinsics.canvas, __VLS_intrinsics.canvas)({
    ref: "waveformCanvas",
    ...{ class: "convolver-waveform-canvas" },
});
/** @type {typeof __VLS_ctx.waveformCanvas} */ ;
// @ts-ignore
[waveformCanvas,];
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "convolver-controls" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.label, __VLS_intrinsics.label)({
    for: "wet-gain",
});
__VLS_asFunctionalElement(__VLS_intrinsics.input)({
    id: "wet-gain",
    type: "range",
    min: "0",
    max: "1",
    step: "0.01",
    ...{ style: (`--value: ${Math.round(__VLS_ctx.wetGainValue * 100)}%`) },
});
(__VLS_ctx.wetGainValue);
// @ts-ignore
[wetGainValue, wetGainValue,];
__VLS_asFunctionalElement(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    key: "wet-gain-display-key",
});
(__VLS_ctx.displayedWetGain);
// @ts-ignore
[displayedWetGain,];
/** @type {__VLS_StyleScopedClasses['convolver-player']} */ ;
/** @type {__VLS_StyleScopedClasses['convolver-examples']} */ ;
/** @type {__VLS_StyleScopedClasses['convolver-ir']} */ ;
/** @type {__VLS_StyleScopedClasses['convolver-ir-info']} */ ;
/** @type {__VLS_StyleScopedClasses['convolver-waveform-canvas']} */ ;
/** @type {__VLS_StyleScopedClasses['convolver-controls']} */ ;
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
    props: {},
});
export default {};
