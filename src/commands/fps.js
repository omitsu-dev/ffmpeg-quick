import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("fps")
    .description("Change video frame rate")
    .argument("<input>", "Input video file")
    .argument("<rate>", "Target frame rate (e.g. 24, 30, 60)")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, rate, opts) => {
      const fps = parseFloat(rate);
      if (isNaN(fps) || fps <= 0) {
        console.error("Error: frame rate must be a positive number.");
        process.exit(1);
      }

      const out = opts.output || outputName(input, `${fps}fps`);
      const args = ["-i", input, "-vf", `fps=${fps}`, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
