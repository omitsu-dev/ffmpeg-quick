import { basename, extname, dirname, join } from "node:path";

/**
 * Generate output filename based on input and suffix.
 * e.g. input.mp4 + "compressed" → input-compressed.mp4
 */
export function outputName(input, suffix, ext) {
  const dir = dirname(input);
  const base = basename(input, extname(input));
  const outExt = ext || extname(input);
  return join(dir, `${base}-${suffix}${outExt}`);
}

/**
 * Parse and validate a positive number from a string argument.
 * Exits with an error message if invalid.
 */
export function parsePositiveNumber(value, name) {
  const n = parseFloat(value);
  if (isNaN(n) || n <= 0) {
    console.error(`Error: ${name} must be a positive number.`);
    process.exit(1);
  }
  return n;
}

/**
 * Parse a preset-based strength option.
 * Accepts named presets (light/medium/strong) or numeric values.
 */
export function parsePreset(value, presets, name) {
  if (presets[value] !== undefined) return presets[value];
  const n = parseFloat(value);
  if (isNaN(n) || n <= 0) {
    console.error(`Error: ${name} must be ${Object.keys(presets).join(", ")}, or a positive number.`);
    process.exit(1);
  }
  return n;
}
