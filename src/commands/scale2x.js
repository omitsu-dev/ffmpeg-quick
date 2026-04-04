import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("scale2x")
    .description("Upscale video by 2x using super2xsai pixel-art scaler")
    .argument("<input>", "Input video file")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const out = opts.output || outputName(input, "2x");
      const args = ["-i", input, "-vf", "super2xsai", "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
