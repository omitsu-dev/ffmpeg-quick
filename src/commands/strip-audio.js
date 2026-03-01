import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("strip-audio")
    .description("Remove audio track from video")
    .argument("<input>", "Input video file")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const out = opts.output || outputName(input, "noaudio");
      const args = [
        "-i", input,
        "-an",
        "-c:v", "copy",
      ];
      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
