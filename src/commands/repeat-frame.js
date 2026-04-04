import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("repeat-frame")
    .description("Hold the last frame of a video for extra seconds")
    .argument("<input>", "Input video file")
    .argument("<seconds>", "Duration to hold last frame")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, seconds, opts) => {
      const out = opts.output || outputName(input, "hold");
      const args = [
        "-i", input,
        "-vf", `tpad=stop_mode=clone:stop_duration=${seconds}`,
        "-c:a", "copy",
      ];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
