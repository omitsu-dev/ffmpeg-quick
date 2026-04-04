import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("deblock")
    .description("Remove block artifacts from compressed video")
    .argument("<input>", "Input video file")
    .option("--strength <n>", "Filter strength (1-100)", "50")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const strength = parseInt(opts.strength, 10);
      const alpha = Math.min(1, strength / 100).toFixed(2);
      const filter = `deblock=filter=weak:alpha=${alpha}:beta=${alpha}`;
      const out = opts.output || outputName(input, "deblocked");
      const args = ["-i", input, "-vf", filter, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
