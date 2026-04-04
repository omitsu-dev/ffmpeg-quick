import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("equalize")
    .description("Auto-correct colors with histogram equalization")
    .argument("<input>", "Input video file")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const out = opts.output || outputName(input, "equalized");
      const args = ["-i", input, "-vf", "histeq", "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
