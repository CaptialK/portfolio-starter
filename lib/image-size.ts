/**
 * Reads how wide and tall an image is, straight from the file.
 *
 * WHY THIS EXISTS
 * `next/image` needs to know an image's real proportions before it loads it.
 * Without them it can't hold the right amount of space, and the page jumps as
 * each picture arrives — which CLAUDE.md forbids and which is genuinely
 * horrible to read.
 *
 * Every image format writes its size into the first few dozen bytes of the
 * file, so this reads those bytes rather than adding a library to do it.
 *
 * If it meets a format it can't read, it says so, names the file, and stops.
 * A guessed shape would be worse than an error: it would look fine until it
 * didn't.
 */

import fs from "node:fs";

export type ImageSize = { width: number; height: number };

/** JPEG markers that introduce a frame, and therefore carry the dimensions. */
const JPEG_FRAME_MARKERS = new Set([
  0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf,
]);

function readPng(b: Buffer): ImageSize | null {
  // 8-byte signature, then the IHDR chunk: length, type, width, height.
  if (b.length < 24) return null;
  if (b.readUInt32BE(0) !== 0x89504e47) return null;
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}

function readJpeg(b: Buffer): ImageSize | null {
  if (b.length < 4 || b.readUInt16BE(0) !== 0xffd8) return null;

  let i = 2;
  while (i < b.length - 9) {
    if (b[i] !== 0xff) {
      i++; // resynchronise: padding between segments is legal
      continue;
    }
    const marker = b[i + 1];
    // Standalone markers carry no length field.
    if (marker === 0xff || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd9)) {
      i += 2;
      continue;
    }
    const length = b.readUInt16BE(i + 2);
    if (JPEG_FRAME_MARKERS.has(marker)) {
      // segment: length(2) precision(1) height(2) width(2)
      return { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) };
    }
    i += 2 + length;
  }
  return null;
}

function readGif(b: Buffer): ImageSize | null {
  if (b.length < 10 || b.toString("ascii", 0, 3) !== "GIF") return null;
  return { width: b.readUInt16LE(6), height: b.readUInt16LE(8) };
}

function readWebp(b: Buffer): ImageSize | null {
  if (b.length < 30) return null;
  if (b.toString("ascii", 0, 4) !== "RIFF" || b.toString("ascii", 8, 12) !== "WEBP") {
    return null;
  }
  const kind = b.toString("ascii", 12, 16);
  if (kind === "VP8X") {
    // Three bytes each, little-endian, and stored as size minus one.
    const width = 1 + (b[24] | (b[25] << 8) | (b[26] << 16));
    const height = 1 + (b[27] | (b[28] << 8) | (b[29] << 16));
    return { width, height };
  }
  if (kind === "VP8 ") {
    return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
  }
  if (kind === "VP8L") {
    const bits = b.readUInt32LE(21);
    return { width: 1 + (bits & 0x3fff), height: 1 + ((bits >> 14) & 0x3fff) };
  }
  return null;
}

/**
 * @param file  absolute path to the image.
 * @throws      if the file can't be read or the format isn't one of
 *              PNG, JPEG, GIF or WebP.
 */
export function imageSize(file: string): ImageSize {
  // The header is all we need; 64KB is far more than any of these formats use.
  const handle = fs.openSync(file, "r");
  const buffer = Buffer.alloc(Math.min(65536, fs.fstatSync(handle).size));
  fs.readSync(handle, buffer, 0, buffer.length, 0);
  fs.closeSync(handle);

  const size =
    readPng(buffer) ?? readJpeg(buffer) ?? readGif(buffer) ?? readWebp(buffer);

  if (!size || !size.width || !size.height) {
    throw new Error(
      `Couldn't work out the size of ${file}. Supported formats are PNG, ` +
        `JPEG, GIF and WebP — re-export it as one of those.`,
    );
  }

  return size;
}
