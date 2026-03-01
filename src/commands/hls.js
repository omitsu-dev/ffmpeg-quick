import { run } from "../run.js";
import { basename, extname, dirname, join } from "node:path";

export function register(program) {
  program
    .command("hls")
    .description("Generate HLS segments for streaming")
    .argument("<input>", "Input video file")
    .option("--segment <sec>", "Segment duration in seconds", "6")
    .option("-o, --output <path>", "Output playlist path (.m3u8)")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const dir = dirname(input);
      const base = basename(input, extname(input));
      const out = opts.output || join(dir, `${base}.m3u8`);
      const segmentPattern = join(dirname(out), `${basename(out, ".m3u8")}_%03d.ts`);
      const args = [
        "-i", input,
        "-c:v", "libx264",
        "-c:a", "aac",
        "-hls_time", opts.segment,
        "-hls_list_size", "0",
        "-hls_segment_filename", segmentPattern,
      ];
      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
