import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("deflicker")
    .description("Remove flicker from video (useful for timelapse)")
    .argument("<input>", "Input video file")
    .option("--size <n>", "Averaging window size (must be odd)", "5")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const out = opts.output || outputName(input, "deflickered");
      const args = ["-i", input, "-vf", `deflicker=size=${opts.size}`, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
