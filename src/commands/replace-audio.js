import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("replace-audio")
    .description("Replace audio track with a different audio file")
    .argument("<input>", "Input video file")
    .argument("<audio>", "New audio file (mp3, wav, etc.)")
    .option("--shortest", "End when the shorter stream ends")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, audio, opts) => {
      const out = opts.output || outputName(input, "newaudio");
      const args = [
        "-i", input,
        "-i", audio,
        "-map", "0:v",
        "-map", "1:a",
        "-c:v", "copy",
      ];

      if (opts.shortest) args.push("-shortest");
      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
