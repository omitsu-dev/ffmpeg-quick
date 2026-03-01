import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("thumbnail")
    .description("Extract a thumbnail image from video")
    .argument("<input>", "Input video file")
    .option("-s, --start <sec>", "Time position in seconds", "1")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const out = opts.output || outputName(input, "thumb", ".jpg");
      const args = [
        "-ss", opts.start,
        "-i", input,
        "-frames:v", "1",
        "-q:v", "2",
      ];
      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
