// packages/core/convolver-player-core/src/waveformDrawer.ts

/**
 * Draws a waveform of an AudioBuffer onto a 2D canvas context.
 * @param ctx The CanvasRenderingContext2D to draw on.
 * @param buffer The AudioBuffer containing the audio data.
 * @param width The width of the drawing area on the canvas.
 * @param height The height of the drawing area on the canvas.
 * @param color The color to use for drawing the waveform.
 */
export function drawWaveform(
  ctx: CanvasRenderingContext2D,
  buffer: AudioBuffer,
  width: number,
  height: number,
  color: string
): void {
  ctx.clearRect(0, 0, width, height);

  const data = buffer.getChannelData(0); // Use the first channel for waveform
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

  if (maxAmplitude === 0) maxAmplitude = 0.01; // Avoid division by zero

  const verticalCenter = height / 2;

  ctx.beginPath();
  ctx.strokeStyle = color;
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
}

/**
 * Sets up a canvas for high-DPI rendering and returns its 2D rendering context.
 * @param canvas The HTMLCanvasElement to set up.
 * @returns The CanvasRenderingContext2D for the canvas.
 */
export function setupCanvasContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D | null {
  const rect = canvas.getBoundingClientRect();
  const logicalWidth = rect.width;
  const logicalHeight = rect.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const dpr = window.devicePixelRatio || 1;
  canvas.width = logicalWidth * dpr;
  canvas.height = logicalHeight * dpr;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

/**
 * Gets the computed accent color from a given HTML element.
 * @param element The HTML element to get the accent color from.
 * @param fallbackColor A fallback color to use if accent-color is not found or is invalid.
 * @returns The computed accent color.
 */
export function getAccentColor(element: HTMLElement, fallbackColor: string = "#007aff"): string {
  const computedStyle = getComputedStyle(element);
  const accentColor = computedStyle.getPropertyValue("accent-color").trim();
  return accentColor || fallbackColor;
}
