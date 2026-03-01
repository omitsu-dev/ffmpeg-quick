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
