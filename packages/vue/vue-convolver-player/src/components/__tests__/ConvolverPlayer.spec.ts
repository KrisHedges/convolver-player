import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import ConvolverPlayer from '../ConvolverPlayer.vue';
import { MockAudioContext } from '../../../vitest.setup'; // Import MockAudioContext

describe('ConvolverPlayer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders properly', () => {
    const wrapper = mount(ConvolverPlayer, {
      props: {
        irFilePath: '/ir.wav',
      },
    });
    expect(wrapper.exists()).toBe(true);
  });

  it('loads the impulse response from irFilePath', async () => {
    const irFilePath = '/test-ir.wav';
    mount(ConvolverPlayer, {
      props: {
        irFilePath,
      },
    });

    await new Promise(resolve => setTimeout(resolve, 0)); // Wait for promises to resolve

    // Expect fetch to be called with the correct IR file path
    expect(global.fetch).toHaveBeenCalledWith(irFilePath);

    // Expect decodeAudioData to be called on our mocked AudioContext
    expect(MockAudioContext.prototype.decodeAudioData).toHaveBeenCalled();
  });

  it('plays a test sound when a button is clicked', async () => {
    const irFilePath = '/test-ir.wav';
    const wrapper = mount(ConvolverPlayer, {
      props: {
        irFilePath,
      },
    });

    await new Promise(resolve => setTimeout(resolve, 0)); // Wait for IR to load

    // Simulate a click on the first test sound button
    const clickButton = wrapper.find('.convolver-examples').findAll('button')[0];
    await clickButton.trigger('click');

    await new Promise(resolve => setTimeout(resolve, 0)); // Wait for test sound to load and play

    // Expect fetch to be called for the test sound
    expect(global.fetch).toHaveBeenCalledWith('/src/assets/sounds/click.wav');

    // Expect decodeAudioData to be called for the test sound
    expect(MockAudioContext.prototype.decodeAudioData).toHaveBeenCalled();

    // Expect createBufferSource to be called
    expect(MockAudioContext.prototype.createBufferSource).toHaveBeenCalled();

    // Expect createConvolver to be called
    expect(MockAudioContext.prototype.createConvolver).toHaveBeenCalled();

    // Expect createGain to be called for wet and dry
    expect(MockAudioContext.prototype.createGain).toHaveBeenCalledTimes(2);

    // Expect start to be called on the buffer source
    const bufferSourceInstance = MockAudioContext.prototype.createBufferSource.mock.results[0].value;
    expect(bufferSourceInstance.start).toHaveBeenCalledWith(0);
  });

  it('uses the provided audioContext prop', async () => {
    const irFilePath = '/test-ir.wav';
    const providedAudioContext = new MockAudioContext();
    const spyOnAudioContextConstructor = vi.spyOn(global, 'AudioContext');

    mount(ConvolverPlayer, {
      props: {
        irFilePath,
        audioContext: providedAudioContext,
      },
    });

    await new Promise(resolve => setTimeout(resolve, 0)); // Wait for promises to resolve

    // Expect the global AudioContext constructor NOT to be called
    expect(spyOnAudioContextConstructor).not.toHaveBeenCalled();

    // Expect decodeAudioData to be called on the provided audioContext
    expect(providedAudioContext.decodeAudioData).toHaveBeenCalled();
  });

  it('updates wet and dry gain values when slider changes', async () => {
    const irFilePath = '/test-ir.wav';
    const wrapper = mount(ConvolverPlayer, {
      props: {
        irFilePath,
      },
    });

    await new Promise(resolve => setTimeout(resolve, 0)); // Wait for IR to load

    const clickButton = wrapper.find('.convolver-examples').findAll('button')[0];
    await clickButton.trigger('click');

    await new Promise(resolve => setTimeout(resolve, 0)); // Wait for test sound to load and play

    // Get references to the mocked gain nodes
    const createGainSpy = MockAudioContext.prototype.createGain;
    const wetGainNode = createGainSpy.mock.results[0].value; // Assuming first call is for wet gain
    const dryGainNode = createGainSpy.mock.results[1].value; // Assuming second call is for dry gain

    // Simulate changing the slider value
    const slider = wrapper.find('#wet-gain');
    await slider.setValue(0.5); // Set wet gain to 50%

    // Expect wet gain to be 0.5 and dry gain to be 0.5
    expect(Number(wetGainNode.gain.value)).toBe(0.5);
    expect(Number(dryGainNode.gain.value)).toBe(0.5);

    await slider.setValue(0.2); // Set wet gain to 20%

    // Expect wet gain to be 0.2 and dry gain to be 0.8
    expect(Number(dryGainNode.gain.value)).toBe(0.8);
    expect(Number(wetGainNode.gain.value)).toBe(0.2);
  });

  it('displays IR information after loading', async () => {
    const irFilePath = '/test-ir.wav';
    const wrapper = mount(ConvolverPlayer, {
      props: {
        irFilePath,
      },
    });

    await new Promise(resolve => setTimeout(resolve, 0)); // Wait for IR to load

    // Check if the IR information is displayed
    const info = wrapper.find('.convolver-ir-info');
    expect(info.exists()).toBe(true);
    expect(info.text()).toContain('Duration: 0.10s');
    expect(info.text()).toContain('Sample Rate: 44100Hz');
    expect(info.text()).toContain('Channels: 1');
  });

  it('draws the waveform after loading', async () => {
    const irFilePath = '/test-ir.wav';
    mount(ConvolverPlayer, {
      props: {
        irFilePath,
      },
    });

    await new Promise(resolve => setTimeout(resolve, 0)); // Wait for IR to load

    // Check if the canvas context methods were called
    const canvasContext = HTMLCanvasElement.prototype.getContext('2d');
    expect(canvasContext.clearRect).toHaveBeenCalled();
    expect(canvasContext.beginPath).toHaveBeenCalled();
    expect(canvasContext.lineTo).toHaveBeenCalled();
    expect(canvasContext.stroke).toHaveBeenCalled();
  });

  it('creates a local AudioContext if not provided', async () => {
    const irFilePath = '/test-ir.wav';
    const wrapper = mount(ConvolverPlayer, {
      props: {
        irFilePath,
      },
    });

    await new Promise(resolve => setTimeout(resolve, 0)); // Wait for IR to load

    // Simulate a click on the first test sound button
    const clickButton = wrapper.find('.convolver-examples').findAll('button')[0];
    await clickButton.trigger('click');

    await new Promise(resolve => setTimeout(resolve, 0)); // Wait for test sound to load and play

    // Expect that a local AudioContext was created and used
    expect(wrapper.vm.localAudioContext).not.toBeNull();
    const localAudioContext = wrapper.vm.localAudioContext;
    expect(localAudioContext.createBufferSource).toHaveBeenCalled();
    expect(localAudioContext.createConvolver).toHaveBeenCalled();
    expect(localAudioContext.createGain).toHaveBeenCalledTimes(2);
  });

  it('resumes a suspended audioContext', async () => {
    const irFilePath = '/test-ir.wav';
    const providedAudioContext = new MockAudioContext();
    providedAudioContext.state = 'suspended';

    const wrapper = mount(ConvolverPlayer, {
      props: {
        irFilePath,
        audioContext: providedAudioContext,
      },
    });

    await new Promise(resolve => setTimeout(resolve, 0)); // Wait for IR to load

    // Simulate a click on the first test sound button
    const clickButton = wrapper.find('.convolver-examples').findAll('button')[0];
    await clickButton.trigger('click');

    await new Promise(resolve => setTimeout(resolve, 0)); // Wait for test sound to load and play

    // Expect that the resume method was called on the provided audioContext
    expect(providedAudioContext.resume).toHaveBeenCalled();
  });

  it('warns when audioContext or irBuffer is not ready', async () => {
    const wrapper = mount(ConvolverPlayer, {
      props: {
        irFilePath: '/test-ir.wav',
      },
    });

    // Spy on console.warn
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Directly set the computed property to return null
    wrapper.vm.currentAudioContext = null;
    wrapper.vm.irBuffer = null;

    // Call the function directly
    await wrapper.vm.playTestSound({ label: 'Click', type: 'sample', path: 'test.wav' });

    // Expect that a warning was logged
    expect(consoleWarnSpy).toHaveBeenCalledWith('AudioContext or ConvolverProcessor not initialized.');
  });

  it('clears the irBuffer and canvas when irFilePath becomes null', async () => {
    const irFilePath = '/test-ir.wav';
    const wrapper = mount(ConvolverPlayer, {
      props: {
        irFilePath,
      },
    });

    await new Promise(resolve => setTimeout(resolve, 0)); // Wait for IR to load

    // Expect irBuffer to be set
    expect(wrapper.vm.irBuffer).not.toBeNull();

    // Set irFilePath to null
    await wrapper.setProps({ irFilePath: null });
    await new Promise(resolve => setTimeout(resolve, 0)); // Wait for the component to update

    // Expect irBuffer to be null
    expect(wrapper.vm.irBuffer).toBeNull();

    // Expect the canvas to be cleared
    const canvasContext = HTMLCanvasElement.prototype.getContext('2d');
    expect(canvasContext.clearRect).toHaveBeenCalled();
  });

  it('cleans up on unmount', async () => {
    const irFilePath = '/test-ir.wav';
    const cancelAnimationFrameSpy = vi.spyOn(window, 'cancelAnimationFrame');

    const wrapper = mount(ConvolverPlayer, {
      props: {
        irFilePath,
      },
    });

    await new Promise(resolve => setTimeout(resolve, 0)); // Wait for component to mount

    const localAudioContext = wrapper.vm.localAudioContext;
    const resizeObserver = wrapper.vm.resizeObserver;
    const rafId = wrapper.vm.rafId;

    // Unmount the component
    wrapper.unmount();

    // Expect cleanup functions to have been called
    expect(resizeObserver.disconnect).toHaveBeenCalled();
    expect(cancelAnimationFrameSpy).toHaveBeenCalledWith(rafId);
    expect(localAudioContext.close).toHaveBeenCalled();
  });
});
