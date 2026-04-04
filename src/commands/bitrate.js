import { run } from "../run.js";
import { outputName } from "../utils.js";

export function register(program) {
  program
    .command("bitrate")
    .description("Re-encode video to a target bitrate (file size control)")
    .argument("<input>", "Input video file")
    .argument("<rate>", "Target video bitrate (e.g. 1M, 2500k, 500k)")
    .option("--audio-bitrate <rate>", "Audio bitrate", "128k")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, rate, opts) => {
      const out = opts.output || outputName(input, `${rate}`);
      const args = [
        "-i", input,
        "-c:v", "libx264",
        "-b:v", rate,
        "-c:a", "aac",
        "-b:a", opts.audioBitrate,
        "-movflags", "+faststart",
      ];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
