import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("audio-karaoke")
    .description("Remove vocals from audio (center channel removal)")
    .argument("<input>", "Input video/audio file")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const out = opts.output || outputName(input, "karaoke");
      const args = [
        "-i", input,
        "-af", "pan=stereo|c0=c0-c1|c1=c1-c0",
        "-c:v", "copy",
      ];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
