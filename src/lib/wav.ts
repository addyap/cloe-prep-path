type Pcm = { format: Uint8Array; samples: Uint8Array; byteRate: number; blockAlign: number };

export function pcmToWav(samples: Float32Array, sampleRate: number): ArrayBuffer {
  if (sampleRate !== 24000 || !samples.length || samples.length > 12 * 1024 * 1024) {
    throw new Error("Kokoro returned invalid audio samples.");
  }
  const bytes = new Uint8Array(44 + samples.length * 2);
  const view = new DataView(bytes.buffer);
  const tag = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i++) bytes[offset + i] = value.charCodeAt(i);
  };
  tag(0, "RIFF");
  view.setUint32(4, bytes.length - 8, true);
  tag(8, "WAVE");
  tag(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  tag(36, "data");
  view.setUint32(40, samples.length * 2, true);
  samples.forEach((value, i) => {
    if (!Number.isFinite(value)) throw new Error("Kokoro returned invalid audio samples.");
    const clamped = Math.max(-1, Math.min(1, value));
    view.setInt16(44 + i * 2, Math.round(clamped * (clamped < 0 ? 32768 : 32767)), true);
  });
  return bytes.buffer;
}

function readWav(buffer: ArrayBuffer): Pcm {
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);
  const tag = (offset: number) => String.fromCharCode(...bytes.subarray(offset, offset + 4));
  if (bytes.length < 44 || tag(0) !== "RIFF" || tag(8) !== "WAVE") {
    throw new Error("Kokoro returned invalid WAV audio.");
  }
  let format: Uint8Array | undefined;
  let samples: Uint8Array | undefined;
  for (let offset = 12; offset + 8 <= bytes.length; ) {
    const size = view.getUint32(offset + 4, true);
    const start = offset + 8;
    if (start + size > bytes.length) throw new Error("Kokoro returned truncated WAV audio.");
    if (tag(offset) === "fmt ") format = bytes.slice(start, start + size);
    if (tag(offset) === "data") samples = bytes.subarray(start, start + size);
    offset = start + size + (size % 2);
  }
  if (!format || format.length < 16 || !samples?.length) {
    throw new Error("Kokoro returned empty WAV audio.");
  }
  const fmt = new DataView(format.buffer, format.byteOffset, format.byteLength);
  const channels = fmt.getUint16(2, true);
  const sampleRate = fmt.getUint32(4, true);
  const byteRate = fmt.getUint32(8, true);
  const blockAlign = fmt.getUint16(12, true);
  if (
    fmt.getUint16(0, true) !== 1 ||
    fmt.getUint16(14, true) !== 16 ||
    channels < 1 ||
    channels > 2 ||
    sampleRate < 8000 ||
    sampleRate > 48000 ||
    blockAlign !== channels * 2 ||
    byteRate !== sampleRate * blockAlign ||
    samples.length % blockAlign !== 0
  )
    throw new Error("Kokoro must return 16-bit PCM WAV audio.");
  return { format: format.slice(0, 16), samples, byteRate, blockAlign };
}

// Join PCM samples under ONE RIFF header. Concatenating MP3/WAV files can lose
// later dialogue turns or report the duration of only the first segment.
export function joinWav(segments: ArrayBuffer[]): ArrayBuffer {
  if (!segments.length) throw new Error("No speech audio was generated.");
  const decoded = segments.map(readWav);
  const first = decoded[0];
  if (decoded.some((part) => part.format.some((value, i) => value !== first.format[i]))) {
    throw new Error("Kokoro returned inconsistent audio formats.");
  }
  const pause = Math.round((first.byteRate * 0.18) / first.blockAlign) * first.blockAlign;
  const size =
    decoded.reduce((sum, part) => sum + part.samples.length, 0) + pause * (decoded.length - 1);
  if (size > 24 * 1024 * 1024) throw new Error("Generated speech is too long.");
  const output = new Uint8Array(44 + size);
  const view = new DataView(output.buffer);
  const tag = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i++) output[offset + i] = value.charCodeAt(i);
  };
  tag(0, "RIFF");
  view.setUint32(4, 36 + size, true);
  tag(8, "WAVE");
  tag(12, "fmt ");
  view.setUint32(16, 16, true);
  output.set(first.format, 20);
  tag(36, "data");
  view.setUint32(40, size, true);
  let offset = 44;
  decoded.forEach((part, i) => {
    output.set(part.samples, offset);
    offset += part.samples.length + (i < decoded.length - 1 ? pause : 0);
  });
  return output.buffer;
}
