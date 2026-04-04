import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("motion-blur")
    .description("Apply motion blur effect to video")
    .argument("<input>", "Input video file")
    .option("--frames <n>", "Number of frames to blend (higher = more blur)", "5")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const out = opts.output || outputName(input, "motion-blur");
      const args = ["-i", input, "-vf", `tmix=frames=${opts.frames}`, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
