import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("trim")
    .description("Cut a section from a video")
    .argument("<input>", "Input video file")
    .option("-s, --start <time>", "Start time in seconds or HH:MM:SS", "0")
    .option("-d, --duration <time>", "Duration in seconds")
    .option("-t, --to <time>", "End time in seconds or HH:MM:SS")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      if (!opts.duration && !opts.to) {
        console.error("Error: specify --duration (-d) or --to (-t).");
        process.exit(1);
      }

      const out = opts.output || outputName(input, "trimmed");
      const args = ["-i", input, "-ss", opts.start];

      if (opts.duration) {
        args.push("-t", opts.duration);
      } else {
        args.push("-to", opts.to);
      }

      args.push("-c", "copy", "-map", "0");

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
