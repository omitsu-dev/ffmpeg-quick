import { run } from "../run.js";
import { basename, extname, dirname, join } from "node:path";

export function register(program) {
  program
    .command("gif-to-video")
    .description("Convert GIF to video (MP4)")
    .argument("<input>", "Input GIF file")
    .option("--loop <n>", "Number of loops (0 = single play)", "0")
    .option("-o, --output <path>", "Output file path")
    .option("--dry-run", "Print the FFmpeg command without running it")
    .option("-y", "Overwrite output without asking")
    .action((input, opts) => {
      const dir = dirname(input);
      const base = basename(input, extname(input));
      const out = opts.output || join(dir, `${base}.mp4`);

      const args = ["-i", input];
      if (parseInt(opts.loop, 10) > 0) {
        args.unshift("-stream_loop", opts.loop);
      }
      args.push(
        "-movflags", "faststart",
        "-pix_fmt", "yuv420p",
        "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2",
      );

      if (opts.y) args.push("-y");
      args.push(out);
      run(args, { dryRun: opts.dryRun });
    });
}
