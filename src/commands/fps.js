import { run } from "../run.js";
import { outputName, parsePositiveNumber } from "../utils.js";

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
      const fps = parsePositiveNumber(rate, "frame rate");
      const out = opts.output || outputName(input, `${fps}fps`);
      const args = ["-i", input, "-vf", `fps=${fps}`, "-c:a", "copy"];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
