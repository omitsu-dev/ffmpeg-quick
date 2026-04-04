import { run } from "../run.js";
import { parsePositiveNumber } from "../utils.js";
import { basename, extname, dirname, join } from "node:path";

export function register(program) {
  program
    .command("split")
    .description("Split video into segments of equal duration")
    .argument("<input>", "Input video file")
    .argument("<seconds>", "Segment duration in seconds")
    .option("-o, --output <pattern>", "Output pattern (e.g. part-%03d.mp4)")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, seconds, opts) => {
      const duration = parsePositiveNumber(seconds, "segment duration");

      const dir = dirname(input);
      const base = basename(input, extname(input));
      const ext = extname(input);
      const out = opts.output || join(dir, `${base}-part%03d${ext}`);

      const args = [
        "-i", input,
        "-c", "copy",
        "-map", "0",
        "-f", "segment",
        "-segment_time", String(duration),
        "-reset_timestamps", "1",
      ];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
