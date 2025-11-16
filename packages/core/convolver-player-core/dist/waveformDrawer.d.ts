/**
 * Draws a waveform of an AudioBuffer onto a 2D canvas context.
 * @param ctx The CanvasRenderingContext2D to draw on.
 * @param buffer The AudioBuffer containing the audio data.
 * @param width The width of the drawing area on the canvas.
 * @param height The height of the drawing area on the canvas.
 * @param color The color to use for drawing the waveform.
 */
export declare function drawWaveform(ctx: CanvasRenderingContext2D, buffer: AudioBuffer, width: number, height: number, color: string): void;
/**
 * Sets up a canvas for high-DPI rendering and returns its 2D rendering context.
 * @param canvas The HTMLCanvasElement to set up.
 * @returns The CanvasRenderingContext2D for the canvas.
 */
export declare function setupCanvasContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D | null;
/**
 * Gets the computed accent color from a given HTML element.
 * @param element The HTML element to get the accent color from.
 * @param fallbackColor A fallback color to use if accent-color is not found or is invalid.
 * @returns The computed accent color.
 */
export declare function getAccentColor(element: HTMLElement, fallbackColor?: string): string;
