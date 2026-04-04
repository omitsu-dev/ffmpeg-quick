import { run } from "../run.js";
import { basename, extname, dirname, join } from "node:path";

export function register(program) {
  program
    .command("dash")
    .description("Generate MPEG-DASH segments for adaptive streaming")
    .argument("<input>", "Input video file")
    .option("--segment <sec>", "Segment duration in seconds", "4")
    .option("-o, --output <path>", "Output manifest path (.mpd)")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const dir = dirname(input);
      const base = basename(input, extname(input));
      const out = opts.output || join(dir, `${base}.mpd`);

      const args = [
        "-i", input,
        "-c:v", "libx264",
        "-c:a", "aac",
        "-f", "dash",
        "-seg_duration", opts.segment,
        "-use_timeline", "1",
        "-use_template", "1",
      ];

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
