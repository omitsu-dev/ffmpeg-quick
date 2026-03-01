import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("audio")
    .description("Extract audio as MP3")
    .argument("<input>", "Input video file")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const out = opts.output || outputName(input, "audio", ".mp3");
      const args = [
        "-i", input,
        "-vn",
        "-c:a", "libmp3lame",
        "-q:a", "2",
      ];
      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
