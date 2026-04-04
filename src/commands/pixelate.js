import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("pixelate")
    .description("Apply pixel art / mosaic effect to video")
    .argument("<input>", "Input video file")
    .option("--size <n>", "Pixel block size (larger = more pixelated)", "16")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const s = parseInt(opts.size, 10);
      // Scale down then back up with nearest-neighbor for crisp pixels
      const filter = `scale=iw/${s}:ih/${s}:flags=neighbor,scale=iw*${s}:ih*${s}:flags=neighbor`;
      const out = opts.output || outputName(input, "pixelated");
      const args = ["-i", input, "-vf", filter, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
