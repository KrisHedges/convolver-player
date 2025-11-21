import { onMounted, ref, onBeforeUnmount, nextTick } from 'vue';
import ConvolverPlayer from './components/ConvolverPlayer.vue';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
const sharedAudioContext = ref(null); // Declare sharedAudioContext here
const codeBlocks = ref([]);
const setCodeBlockRef = (el) => {
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
    const context = new (window.AudioContext || window.webkitAudioContext)();
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
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_directives;
__VLS_asFunctionalElement(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "container" },
});
__VLS_asFunctionalElement(__VLS_intrinsics.h1, __VLS_intrinsics.h1)({});
__VLS_asFunctionalElement(__VLS_intrinsics.section, __VLS_intrinsics.section)({});
__VLS_asFunctionalElement(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
__VLS_asFunctionalElement(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
/** @type {[typeof ConvolverPlayer, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(ConvolverPlayer, new ConvolverPlayer({
    irFilePath: "/demo/ir.wav",
}));
const __VLS_1 = __VLS_0({
    irFilePath: "/demo/ir.wav",
}, ...__VLS_functionalComponentArgsRest(__VLS_0));
__VLS_asFunctionalElement(__VLS_intrinsics.pre, __VLS_intrinsics.pre)({});
__VLS_asFunctionalElement(__VLS_intrinsics.code, __VLS_intrinsics.code)({
    ref: (__VLS_ctx.setCodeBlockRef),
    ...{ class: "language-html" },
});
// @ts-ignore
[setCodeBlockRef,];
__VLS_asFunctionalElement(__VLS_intrinsics.section, __VLS_intrinsics.section)({});
__VLS_asFunctionalElement(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
__VLS_asFunctionalElement(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
if (__VLS_ctx.sharedAudioContext) {
    // @ts-ignore
    [sharedAudioContext,];
    /** @type {[typeof ConvolverPlayer, ]} */ ;
    // @ts-ignore
    const __VLS_4 = __VLS_asFunctionalComponent(ConvolverPlayer, new ConvolverPlayer({
        irFilePath: "/demo/ir.wav",
        audioContext: (__VLS_ctx.sharedAudioContext),
    }));
    const __VLS_5 = __VLS_4({
        irFilePath: "/demo/ir.wav",
        audioContext: (__VLS_ctx.sharedAudioContext),
    }, ...__VLS_functionalComponentArgsRest(__VLS_4));
    // @ts-ignore
    [sharedAudioContext,];
    /** @type {[typeof ConvolverPlayer, ]} */ ;
    // @ts-ignore
    const __VLS_8 = __VLS_asFunctionalComponent(ConvolverPlayer, new ConvolverPlayer({
        irFilePath: "/src/assets/sounds/click.wav",
        audioContext: (__VLS_ctx.sharedAudioContext),
    }));
    const __VLS_9 = __VLS_8({
        irFilePath: "/src/assets/sounds/click.wav",
        audioContext: (__VLS_ctx.sharedAudioContext),
    }, ...__VLS_functionalComponentArgsRest(__VLS_8));
    // @ts-ignore
    [sharedAudioContext,];
    /** @type {[typeof ConvolverPlayer, ]} */ ;
    // @ts-ignore
    const __VLS_12 = __VLS_asFunctionalComponent(ConvolverPlayer, new ConvolverPlayer({
        irFilePath: "/src/assets/sounds/piano.wav",
        audioContext: (__VLS_ctx.sharedAudioContext),
    }));
    const __VLS_13 = __VLS_12({
        irFilePath: "/src/assets/sounds/piano.wav",
        audioContext: (__VLS_ctx.sharedAudioContext),
    }, ...__VLS_functionalComponentArgsRest(__VLS_12));
    // @ts-ignore
    [sharedAudioContext,];
    /** @type {[typeof ConvolverPlayer, ]} */ ;
    // @ts-ignore
    const __VLS_16 = __VLS_asFunctionalComponent(ConvolverPlayer, new ConvolverPlayer({
        irFilePath: "/src/assets/sounds/guitar.wav",
        audioContext: (__VLS_ctx.sharedAudioContext),
    }));
    const __VLS_17 = __VLS_16({
        irFilePath: "/src/assets/sounds/guitar.wav",
        audioContext: (__VLS_ctx.sharedAudioContext),
    }, ...__VLS_functionalComponentArgsRest(__VLS_16));
    // @ts-ignore
    [sharedAudioContext,];
}
__VLS_asFunctionalElement(__VLS_intrinsics.pre, __VLS_intrinsics.pre)({});
__VLS_asFunctionalElement(__VLS_intrinsics.code, __VLS_intrinsics.code)({
    ref: (__VLS_ctx.setCodeBlockRef),
    ...{ class: "language-html" },
});
// @ts-ignore
[setCodeBlockRef,];
__VLS_asFunctionalElement(__VLS_intrinsics.section, __VLS_intrinsics.section)({});
__VLS_asFunctionalElement(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
__VLS_asFunctionalElement(__VLS_intrinsics.pre, __VLS_intrinsics.pre)({});
__VLS_asFunctionalElement(__VLS_intrinsics.code, __VLS_intrinsics.code)({
    ref: (__VLS_ctx.setCodeBlockRef),
    ...{ class: "language-html" },
});
// @ts-ignore
[setCodeBlockRef,];
__VLS_asFunctionalElement(__VLS_intrinsics.section, __VLS_intrinsics.section)({});
__VLS_asFunctionalElement(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
__VLS_asFunctionalElement(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement(__VLS_intrinsics.p, __VLS_intrinsics.p)({});
__VLS_asFunctionalElement(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement(__VLS_intrinsics.code, __VLS_intrinsics.code)({});
__VLS_asFunctionalElement(__VLS_intrinsics.pre, __VLS_intrinsics.pre)({});
__VLS_asFunctionalElement(__VLS_intrinsics.code, __VLS_intrinsics.code)({
    ref: (__VLS_ctx.setCodeBlockRef),
    ...{ class: "language-css" },
});
// @ts-ignore
[setCodeBlockRef,];
/** @type {__VLS_StyleScopedClasses['container']} */ ;
/** @type {__VLS_StyleScopedClasses['language-html']} */ ;
/** @type {__VLS_StyleScopedClasses['language-html']} */ ;
/** @type {__VLS_StyleScopedClasses['language-html']} */ ;
/** @type {__VLS_StyleScopedClasses['language-css']} */ ;
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
