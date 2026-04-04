import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("pan-audio")
    .description("Pan audio left/right (stereo positioning)")
    .argument("<input>", "Input video/audio file")
    .argument("<position>", "Pan position: -1.0 (full left) to 1.0 (full right), 0 = center")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, position, opts) => {
      const p = parseFloat(position);
      if (isNaN(p) || p < -1 || p > 1) {
        console.error("Error: position must be between -1.0 (left) and 1.0 (right).");
        process.exit(1);
      }

      // Calculate left/right volumes
      const left = Math.min(1, 1 - p).toFixed(2);
      const right = Math.min(1, 1 + p).toFixed(2);
      const filter = `pan=stereo|c0=${left}*c0+0*c1|c1=0*c0+${right}*c1`;
      const out = opts.output || outputName(input, "panned");
      const args = ["-i", input, "-af", filter, "-c:v", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
