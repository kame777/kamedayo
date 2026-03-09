"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import styles from "./QrGenerator.module.css";
import HeroBanner from "../../components/HeroBanner";
import Button from "../../components/ui/Button";


type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

// ===== Minimal QR Code Generator (no external deps) =====

// Galois field & polynomial math for QR Reed-Solomon
const GF256_EXP = new Uint8Array(512);
const GF256_LOG = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF256_EXP[i] = x;
    GF256_LOG[x] = i;
    x = (x << 1) ^ (x >= 128 ? 0x11d : 0);
  }
  for (let i = 255; i < 512; i++) GF256_EXP[i] = GF256_EXP[i - 255];
})();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return GF256_EXP[GF256_LOG[a] + GF256_LOG[b]];
}

function rsGeneratorPoly(ecLen: number): Uint8Array {
  let g = new Uint8Array([1]);
  for (let i = 0; i < ecLen; i++) {
    const ng = new Uint8Array(g.length + 1);
    for (let j = 0; j < g.length; j++) {
      ng[j] ^= g[j];
      ng[j + 1] ^= gfMul(g[j], GF256_EXP[i]);
    }
    g = ng;
  }
  return g;
}

function rsEncode(data: Uint8Array, ecLen: number): Uint8Array {
  const gen = rsGeneratorPoly(ecLen);
  const msg = new Uint8Array(data.length + ecLen);
  msg.set(data);
  for (let i = 0; i < data.length; i++) {
    const coef = msg[i];
    if (coef === 0) continue;
    for (let j = 0; j < gen.length; j++) {
      msg[i + j] ^= gfMul(gen[j], coef);
    }
  }
  return msg.slice(data.length);
}

// QR version/EC tables (versions 1-40 subset, enough for practical use)
const EC_CODEWORDS_PER_BLOCK: Record<ErrorCorrectionLevel, number[]> = {
  L: [0,7,10,15,20,26,18,20,24,30,18,20,24,26,30,22,24,28,30,28,28,28,28,30,30,26,28,30,30,30,30,30,30,30,30,30,30,30,30,30,30],
  M: [0,10,16,26,18,24,16,18,22,22,26,30,22,22,24,24,28,28,26,26,26,26,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28],
  Q: [0,13,22,18,26,18,24,18,22,20,24,28,26,24,20,30,24,28,28,26,30,28,30,30,30,30,28,30,30,30,30,30,30,30,30,30,30,30,30,30,30],
  H: [0,17,28,22,16,22,28,26,26,24,28,24,28,22,24,24,30,28,28,26,28,30,24,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30,30],
};

const NUM_EC_BLOCKS: Record<ErrorCorrectionLevel, number[][]> = {
  L: [[],[1],[1],[1],[1],[1],[2],[2],[2],[2],[2,2],[4],[2,2],[4],[3,1],[5,1],[5,1],[1,5],[5,1],[3,4],[3,5],[4,4],[2,7],[4,5],[6,4],[8,4],[10,2],[8,4],[3,10],[7,7],[5,10],[13,3],[17],[17,1],[13,6],[12,7],[6,14],[17,4],[4,18],[20,4],[19,6]],
  M: [[],[1],[1],[1],[2],[2],[4],[4],[2,2],[3,2],[4,1],[1,4],[6,2],[8,1],[4,5],[5,5],[7,3],[10,1],[1,10],[5,7],[7,6],[8,5],[9,5],[3,10],[3,11],[4,11],[1,14],[11,5],[11,7],[7,11],[11,7],[2,15],[17,1],[9,10],[15,5],[19,1],[16,6],[17,6],[3,22],[15,10],[8,19]],
  Q: [[],[1],[1],[2],[2],[2,2],[2,2],[4,1],[2,4],[4,2],[6,2],[4,4],[4,6],[8,4],[11,5],[5,7],[15,2],[1,15],[17,1],[17,4],[15,5],[17,6],[7,16],[11,14],[11,16],[7,22],[28,6],[8,26],[4,31],[1,37],[15,25],[42,1],[10,35],[29,19],[44,7],[39,14],[46,10],[49,10],[48,14],[43,22],[34,34]],
  H: [[],[1],[1],[2],[4],[2,2],[4],[4,1],[4,2],[4,4],[6,2],[3,8],[7,4],[12,4],[11,5],[11,7],[3,13],[2,17],[2,19],[9,16],[15,10],[19,6],[34],[16,14],[30,2],[22,13],[33,4],[12,28],[11,31],[19,26],[23,25],[23,28],[19,35],[11,46],[59,1],[22,41],[2,64],[24,46],[42,32],[10,67],[20,61]],
};

const TOTAL_CODEWORDS: number[] = [0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706];

const ALIGNMENT_POSITIONS: number[][] = [[],[], [6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]];

function getDataCapacity(version: number, ecl: ErrorCorrectionLevel): number {
  const totalCW = TOTAL_CODEWORDS[version];
  const ecCWPerBlock = EC_CODEWORDS_PER_BLOCK[ecl][version];
  const blocks = NUM_EC_BLOCKS[ecl][version];
  const totalBlocks = blocks.reduce((s, v) => s + v, 0);
  return totalCW - ecCWPerBlock * totalBlocks;
}

function selectVersion(dataBytes: number, ecl: ErrorCorrectionLevel): number {
  for (let v = 1; v <= 40; v++) {
    if (getDataCapacity(v, ecl) >= dataBytes) return v;
  }
  return -1;
}

function encodeUtf8(str: string): Uint8Array {
  return new TextEncoder().encode(str);
}

function buildDataCodewords(text: string, version: number, ecl: ErrorCorrectionLevel): Uint8Array {
  const utf8 = encodeUtf8(text);
  const capacity = getDataCapacity(version, ecl);
  const bits: number[] = [];

  const push = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1);
  };

  // Byte mode indicator
  push(0b0100, 4);
  // Character count
  const ccBits = version <= 9 ? 8 : 16;
  push(utf8.length, ccBits);
  // Data
  for (const b of utf8) push(b, 8);
  // Terminator
  const maxBits = capacity * 8;
  const termLen = Math.min(4, maxBits - bits.length);
  push(0, termLen);
  // Pad to byte boundary
  while (bits.length % 8 !== 0) bits.push(0);
  // Pad codewords
  const padBytes = [0xec, 0x11];
  let padIdx = 0;
  while (bits.length < maxBits) {
    push(padBytes[padIdx], 8);
    padIdx ^= 1;
  }

  const codewords = new Uint8Array(capacity);
  for (let i = 0; i < capacity; i++) {
    let byte = 0;
    for (let b = 0; b < 8; b++) byte = (byte << 1) | bits[i * 8 + b];
    codewords[i] = byte;
  }
  return codewords;
}

function interleaveBlocks(data: Uint8Array, version: number, ecl: ErrorCorrectionLevel): Uint8Array {
  const ecCWPerBlock = EC_CODEWORDS_PER_BLOCK[ecl][version];
  const blockCounts = NUM_EC_BLOCKS[ecl][version];
  const totalCW = TOTAL_CODEWORDS[version];

  const totalBlocks = blockCounts.reduce((s, v) => s + v, 0);
  const dataCW = data.length;
  const shortBlockData = Math.floor(dataCW / totalBlocks);
  const longBlocks = dataCW - shortBlockData * totalBlocks;

  const dataBlocks: Uint8Array[] = [];
  const ecBlocks: Uint8Array[] = [];
  let offset = 0;

  for (let g = 0; g < blockCounts.length; g++) {
    for (let b = 0; b < blockCounts[g]; b++) {
      const blockIdx = dataBlocks.length;
      const size = shortBlockData + (blockIdx >= totalBlocks - longBlocks ? 1 : 0);
      const block = data.slice(offset, offset + size);
      offset += size;
      dataBlocks.push(block);
      ecBlocks.push(rsEncode(block, ecCWPerBlock));
    }
  }

  const result = new Uint8Array(totalCW);
  let idx = 0;
  const maxDataLen = shortBlockData + (longBlocks > 0 ? 1 : 0);
  for (let i = 0; i < maxDataLen; i++) {
    for (const block of dataBlocks) {
      if (i < block.length) result[idx++] = block[i];
    }
  }
  for (let i = 0; i < ecCWPerBlock; i++) {
    for (const block of ecBlocks) {
      result[idx++] = block[i];
    }
  }
  return result;
}

function createMatrix(version: number): { matrix: number[][]; reserved: boolean[][] } {
  const size = version * 4 + 17;
  const matrix = Array.from({ length: size }, () => new Array(size).fill(0));
  const reserved = Array.from({ length: size }, () => new Array(size).fill(false));

  const markModule = (r: number, c: number, val: number) => {
    if (r >= 0 && r < size && c >= 0 && c < size) {
      matrix[r][c] = val;
      reserved[r][c] = true;
    }
  };

  // Finder patterns
  const placeFinderPattern = (row: number, col: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const inOuter = r >= 0 && r <= 6 && c >= 0 && c <= 6;
        const inInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        const onBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const val = inOuter ? (inInner || onBorder ? 1 : 0) : 0;
        markModule(row + r, col + c, val);
      }
    }
  };

  placeFinderPattern(0, 0);
  placeFinderPattern(0, size - 7);
  placeFinderPattern(size - 7, 0);

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    markModule(6, i, i % 2 === 0 ? 1 : 0);
    markModule(i, 6, i % 2 === 0 ? 1 : 0);
  }

  // Alignment patterns
  if (version >= 2) {
    const pos = ALIGNMENT_POSITIONS[version];
    for (const r of pos) {
      for (const c of pos) {
        if (reserved[r][c]) continue;
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            const val = Math.abs(dr) === 2 || Math.abs(dc) === 2 || (dr === 0 && dc === 0) ? 1 : 0;
            markModule(r + dr, c + dc, val);
          }
        }
      }
    }
  }

  // Dark module
  markModule(size - 8, 8, 1);

  // Reserve format info areas
  for (let i = 0; i < 8; i++) {
    if (!reserved[8][i]) { reserved[8][i] = true; }
    if (!reserved[i][8]) { reserved[i][8] = true; }
    if (!reserved[8][size - 1 - i]) { reserved[8][size - 1 - i] = true; }
    if (!reserved[size - 1 - i][8]) { reserved[size - 1 - i][8] = true; }
  }
  reserved[8][8] = true;

  // Reserve version info for version >= 7
  if (version >= 7) {
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 3; j++) {
        reserved[i][size - 11 + j] = true;
        reserved[size - 11 + j][i] = true;
      }
    }
  }

  return { matrix, reserved };
}

function placeData(matrix: number[][], reserved: boolean[][], codewords: Uint8Array) {
  const size = matrix.length;
  let bitIdx = 0;
  const totalBits = codewords.length * 8;

  for (let col = size - 1; col >= 1; col -= 2) {
    if (col === 6) col = 5; // skip timing column
    for (let row = 0; row < size; row++) {
      for (let c = 0; c < 2; c++) {
        const actualCol = col - c;
        const isUpward = Math.floor((size - 1 - col + (col <= 6 ? 1 : 0)) / 2) % 2 === 0;
        const actualRow = isUpward ? size - 1 - row : row;
        if (reserved[actualRow][actualCol]) continue;
        if (bitIdx < totalBits) {
          matrix[actualRow][actualCol] = (codewords[bitIdx >> 3] >> (7 - (bitIdx & 7))) & 1;
          bitIdx++;
        }
      }
    }
  }
}

const MASK_FUNCTIONS: ((r: number, c: number) => boolean)[] = [
  (r, c) => (r + c) % 2 === 0,
  (r) => r % 2 === 0,
  (_, c) => c % 3 === 0,
  (r, c) => (r + c) % 3 === 0,
  (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
  (r, c) => ((r * c) % 2 + (r * c) % 3) === 0,
  (r, c) => ((r * c) % 2 + (r * c) % 3) % 2 === 0,
  (r, c) => ((r + c) % 2 + (r * c) % 3) % 2 === 0,
];

function applyMask(matrix: number[][], reserved: boolean[][], maskIdx: number): number[][] {
  const size = matrix.length;
  const result = matrix.map(row => [...row]);
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!reserved[r][c] && MASK_FUNCTIONS[maskIdx](r, c)) {
        result[r][c] ^= 1;
      }
    }
  }
  return result;
}

const FORMAT_INFO_STRINGS: Record<ErrorCorrectionLevel, number[]> = {
  L: [0x77c4, 0x72f3, 0x7daa, 0x789d, 0x662f, 0x6318, 0x6c41, 0x6976],
  M: [0x5412, 0x5125, 0x5e7c, 0x5b4b, 0x45f9, 0x40ce, 0x4f97, 0x4aa0],
  Q: [0x355f, 0x3068, 0x3f31, 0x3a06, 0x24b4, 0x2183, 0x2eda, 0x2bed],
  H: [0x1689, 0x13be, 0x1ce7, 0x19d0, 0x0762, 0x0255, 0x0d0c, 0x083b],
};

function placeFormatInfo(matrix: number[][], ecl: ErrorCorrectionLevel, maskIdx: number) {
  const size = matrix.length;
  const info = FORMAT_INFO_STRINGS[ecl][maskIdx];

  const bits: number[] = [];
  for (let i = 14; i >= 0; i--) bits.push((info >> i) & 1);

  // Around top-left finder
  const positions1 = [
    [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 7], [8, 8],
    [7, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8],
  ];
  for (let i = 0; i < 15; i++) {
    matrix[positions1[i][0]][positions1[i][1]] = bits[i];
  }

  // Around other finders
  const positions2 = [
    [size - 1, 8], [size - 2, 8], [size - 3, 8], [size - 4, 8],
    [size - 5, 8], [size - 6, 8], [size - 7, 8],
    [8, size - 8], [8, size - 7], [8, size - 6], [8, size - 5],
    [8, size - 4], [8, size - 3], [8, size - 2], [8, size - 1],
  ];
  for (let i = 0; i < 15; i++) {
    matrix[positions2[i][0]][positions2[i][1]] = bits[i];
  }
}

const VERSION_INFO_BITS: number[] = [0,0,0,0,0,0,0,
  0x07c94, 0x085bc, 0x09a99, 0x0a4d3, 0x0bbf6, 0x0c762, 0x0d847, 0x0e60d,
  0x0f928, 0x10b78, 0x1145d, 0x12a17, 0x13532, 0x149a6, 0x15683, 0x168c9,
  0x177ec, 0x18ec4, 0x191e1, 0x1afab, 0x1b08e, 0x1cc1a, 0x1d33f, 0x1ed75,
  0x1f250, 0x209d5, 0x216f0, 0x228ba, 0x2379f, 0x24b0b, 0x2542e, 0x26a64,
  0x27541, 0x28c69,
];

function placeVersionInfo(matrix: number[][], version: number) {
  if (version < 7) return;
  const size = matrix.length;
  const info = VERSION_INFO_BITS[version];
  for (let i = 0; i < 18; i++) {
    const bit = (info >> i) & 1;
    const r = Math.floor(i / 3);
    const c = size - 11 + (i % 3);
    matrix[r][c] = bit;
    matrix[c][r] = bit;
  }
}

function penaltyScore(matrix: number[][]): number {
  const size = matrix.length;
  let score = 0;

  // Rule 1: consecutive same-color modules
  for (let r = 0; r < size; r++) {
    let count = 1;
    for (let c = 1; c < size; c++) {
      if (matrix[r][c] === matrix[r][c - 1]) { count++; }
      else { if (count >= 5) score += count - 2; count = 1; }
    }
    if (count >= 5) score += count - 2;
  }
  for (let c = 0; c < size; c++) {
    let count = 1;
    for (let r = 1; r < size; r++) {
      if (matrix[r][c] === matrix[r - 1][c]) { count++; }
      else { if (count >= 5) score += count - 2; count = 1; }
    }
    if (count >= 5) score += count - 2;
  }

  // Rule 2: 2x2 blocks
  for (let r = 0; r < size - 1; r++) {
    for (let c = 0; c < size - 1; c++) {
      const v = matrix[r][c];
      if (v === matrix[r][c + 1] && v === matrix[r + 1][c] && v === matrix[r + 1][c + 1]) {
        score += 3;
      }
    }
  }

  // Rule 3: finder-like patterns
  const pattern1 = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0];
  const pattern2 = [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= size - 11; c++) {
      let match1 = true, match2 = true;
      for (let k = 0; k < 11; k++) {
        if (matrix[r][c + k] !== pattern1[k]) match1 = false;
        if (matrix[r][c + k] !== pattern2[k]) match2 = false;
      }
      if (match1 || match2) score += 40;
    }
  }
  for (let c = 0; c < size; c++) {
    for (let r = 0; r <= size - 11; r++) {
      let match1 = true, match2 = true;
      for (let k = 0; k < 11; k++) {
        if (matrix[r + k][c] !== pattern1[k]) match1 = false;
        if (matrix[r + k][c] !== pattern2[k]) match2 = false;
      }
      if (match1 || match2) score += 40;
    }
  }

  // Rule 4: proportion of dark modules
  let dark = 0;
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      if (matrix[r][c] === 1) dark++;
  const pct = (dark * 100) / (size * size);
  const prev5 = Math.floor(pct / 5) * 5;
  const next5 = prev5 + 5;
  score += Math.min(Math.abs(prev5 - 50) / 5, Math.abs(next5 - 50) / 5) * 10;

  return score;
}

function generateQR(text: string, ecl: ErrorCorrectionLevel): number[][] {
  const utf8 = encodeUtf8(text);

  // Calculate needed bytes: 4-bit mode + count + data
  const estimatedBytes = Math.ceil((4 + 8 + utf8.length * 8) / 8); // v1-9 estimate
  let version = selectVersion(estimatedBytes, ecl);
  if (version === -1) {
    // Try with 16-bit count (v10+)
    const est2 = Math.ceil((4 + 16 + utf8.length * 8) / 8);
    version = selectVersion(est2, ecl);
    if (version === -1) throw new Error("データが長すぎます");
  }

  // Recheck with correct count indicator size
  const ccBits = version <= 9 ? 8 : 16;
  const neededBytes = Math.ceil((4 + ccBits + utf8.length * 8) / 8);
  if (neededBytes > getDataCapacity(version, ecl)) {
    version = selectVersion(neededBytes, ecl);
    if (version === -1) throw new Error("データが長すぎます");
  }

  const dataCW = buildDataCodewords(text, version, ecl);
  const allCW = interleaveBlocks(dataCW, version, ecl);
  const { matrix, reserved } = createMatrix(version);
  placeData(matrix, reserved, allCW);

  // Find best mask
  let bestMask = 0;
  let bestScore = Infinity;
  for (let m = 0; m < 8; m++) {
    const masked = applyMask(matrix, reserved, m);
    placeFormatInfo(masked, ecl, m);
    placeVersionInfo(masked, version);
    const s = penaltyScore(masked);
    if (s < bestScore) { bestScore = s; bestMask = m; }
  }

  const finalMatrix = applyMask(matrix, reserved, bestMask);
  placeFormatInfo(finalMatrix, ecl, bestMask);
  placeVersionInfo(finalMatrix, version);

  return finalMatrix;
}

// ===== React Component =====

function renderQRToCanvas(
  canvas: HTMLCanvasElement,
  matrix: number[][],
  moduleSize: number,
  fgColor: string,
  bgColor: string,
) {
  const quietZone = 4;
  const size = matrix.length + quietZone * 2;
  canvas.width = size * moduleSize;
  canvas.height = size * moduleSize;

  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = fgColor;
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (matrix[r][c] === 1) {
        ctx.fillRect(
          (c + quietZone) * moduleSize,
          (r + quietZone) * moduleSize,
          moduleSize,
          moduleSize,
        );
      }
    }
  }
}

function matrixToSvg(
  matrix: number[][],
  moduleSize: number,
  fgColor: string,
  bgColor: string,
): string {
  const quietZone = 4;
  const totalModules = matrix.length + quietZone * 2;
  const totalSize = totalModules * moduleSize;

  let paths = "";
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (matrix[r][c] === 1) {
        const x = (c + quietZone) * moduleSize;
        const y = (r + quietZone) * moduleSize;
        paths += `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="${fgColor}"/>`;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalSize} ${totalSize}" width="${totalSize}" height="${totalSize}"><rect width="${totalSize}" height="${totalSize}" fill="${bgColor}"/>${paths}</svg>`;
}

export default function QrGeneratorPage() {
  const [text, setText] = useState("");
  useEffect(() => { document.title = 'kamedayo | QRコード生成ツール'; }, []);
  const [ecl, setEcl] = useState<ErrorCorrectionLevel>("M");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [moduleSize, setModuleSize] = useState(8);
  const [error, setError] = useState("");
  const [matrix, setMatrix] = useState<number[][] | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generate = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError("テキストまたはURLを入力してください。");
      setMatrix(null);
      return;
    }
    try {
      const m = generateQR(trimmed, ecl);
      setMatrix(m);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "QRコードの生成に失敗しました。");
      setMatrix(null);
    }
  }, [text, ecl]);

  useEffect(() => {
    if (matrix && canvasRef.current) {
      renderQRToCanvas(canvasRef.current, matrix, moduleSize, fgColor, bgColor);
    }
  }, [matrix, moduleSize, fgColor, bgColor]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") generate();
    },
    [generate],
  );

  const downloadPNG = useCallback(() => {
    if (!canvasRef.current) return;
    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  }, []);

  const downloadSVG = useCallback(() => {
    if (!matrix) return;
    const svg = matrixToSvg(matrix, moduleSize, fgColor, bgColor);
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const link = document.createElement("a");
    link.download = "qrcode.svg";
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  }, [matrix, moduleSize, fgColor, bgColor]);

  const copyToClipboard = useCallback(async () => {
    if (!canvasRef.current) return;
    try {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvasRef.current!.toBlob(resolve, "image/png"),
      );
      if (blob) {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      }
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <>
      <HeroBanner
        badge="📱 QR Generator"
        title="QRコード生成ツール"
        subtitle="テキストやURLからQRコードを即座に生成"
      />

      <main className={styles.container}>
        {/* Input */}
        <div className={styles.inputSection}>
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (error) setError("");
            }}
            onKeyDown={handleKeyDown}
            placeholder="テキストやURLを入力してください..."
            rows={4}
            className={styles.textarea}
            autoFocus
          />
          <Button
            onClick={generate}
            disabled={!text.trim()}
          >
            QRコードを生成
          </Button>
        </div>

        {error && (
          <div className={styles.errorMsg}>
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Options */}
        <div className={styles.optionsGrid}>
          <div className={styles.optionGroup}>
            <label className={styles.optionLabel}>誤り訂正レベル</label>
            <select
              value={ecl}
              onChange={(e) => setEcl(e.target.value as ErrorCorrectionLevel)}
              className={styles.select}
            >
              <option value="L">L（7%）</option>
              <option value="M">M（15%）</option>
              <option value="Q">Q（25%）</option>
              <option value="H">H（30%）</option>
            </select>
          </div>

          <div className={styles.optionGroup}>
            <label className={styles.optionLabel}>モジュールサイズ</label>
            <select
              value={moduleSize}
              onChange={(e) => setModuleSize(Number(e.target.value))}
              className={styles.select}
            >
              <option value={4}>小（4px）</option>
              <option value={8}>中（8px）</option>
              <option value={12}>大（12px）</option>
              <option value={16}>特大（16px）</option>
            </select>
          </div>

          <div className={styles.optionGroup}>
            <label className={styles.optionLabel}>前景色</label>
            <div className={styles.colorPicker}>
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className={styles.colorInput}
              />
              <span className={styles.colorValue}>{fgColor}</span>
            </div>
          </div>

          <div className={styles.optionGroup}>
            <label className={styles.optionLabel}>背景色</label>
            <div className={styles.colorPicker}>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className={styles.colorInput}
              />
              <span className={styles.colorValue}>{bgColor}</span>
            </div>
          </div>
        </div>

        {/* QR Result */}
        {matrix && (
          <div className={styles.resultSection}>
            <div className={styles.canvasWrapper}>
              <canvas ref={canvasRef} className={styles.qrCanvas} />
            </div>

            <div className={styles.downloadGroup}>
              <Button variant="secondary" onClick={downloadPNG}>📥 PNGダウンロード</Button>
              <Button variant="secondary" onClick={downloadSVG}>📥 SVGダウンロード</Button>
              <Button variant="secondary" onClick={copyToClipboard}>📋 クリップボードにコピー</Button>
            </div>
          </div>
        )}

        {/* Info */}
        <div className={styles.infoSection}>
          <h2 className={styles.infoTitle}>💡 使い方</h2>
          <ul className={styles.infoList}>
            <li>テキストまたはURLを入力して「QRコードを生成」をクリック</li>
            <li>誤り訂正レベル・サイズ・色をカスタマイズ可能</li>
            <li>PNG・SVG形式でダウンロード、またはクリップボードにコピー</li>
            <li>すべてブラウザ上で完結し、サーバーにデータは送信されません</li>
          </ul>
        </div>
      </main>
    </>
  );
}
