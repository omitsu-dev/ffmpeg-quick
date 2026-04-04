import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("negative")
    .description("Invert colors (negative effect)")
    .argument("<input>", "Input video file")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const out = opts.output || outputName(input, "negative");
      const args = ["-i", input, "-vf", "negate", "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
