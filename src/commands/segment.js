import { run } from "../run.js";

export function register(program) {
  program
    .command("segment")
    .description("Split video into fixed-duration segments")
    .argument("<input>", "Input video file")
    .argument("<duration>", "Segment duration in seconds")
    .option("-o, --output <pattern>", "Output pattern (e.g. seg_%03d.mp4)")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, duration, opts) => {
      const ext = input.includes(".") ? input.split(".").pop() : "mp4";
      const out = opts.output || `segment_%03d.${ext}`;
      const args = [
        "-i", input,
        "-c", "copy",
        "-f", "segment",
        "-segment_time", duration,
        "-reset_timestamps", "1",
      ];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
